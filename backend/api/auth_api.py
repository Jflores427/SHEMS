import datetime
import os
import jwt
import pymysql
from flask import jsonify, make_response, request
from werkzeug.security import check_password_hash

SECRET_KEY = os.getenv("JWT_SECRET_KEY")

# connect to the MySQL database configuration
def get_db_connection():
    config = {
        'host': 'localhost',
        'user': 'root',
        'database': 'shems_test1',
        'charset': 'utf8mb4',
        'cursorclass': pymysql.cursors.DictCursor
    }
    return pymysql.connect(**config)

def auth_configure_routes(app):
    # Login API Route
    @app.route("/api/auth/login", methods=["POST"])
    def login():
        conn = None
        try:
            data = request.get_json()
            username = data["username"]
            password = data["password"]

            conn = get_db_connection()
            with conn.cursor() as cursor:
                # Using prepared statement to prevent SQL injection
                cursor.execute("SELECT * FROM User WHERE username = %s", (username,))
                user = cursor.fetchone()

                if user and check_password_hash(user["password_hash"], password):
                    # Generate JWT token
                    expires_at = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)  
                    access_token = jwt.encode(
                        {"identity" : {"user_id": user["user_id"], "username": user["username"], "customer_id": user["customer_id"]}, "exp" : expires_at},
                        SECRET_KEY, algorithm="HS256"
                    )

                    # Store token in the database
                    with conn.cursor() as cursor:
                        cursor.execute(
                            "INSERT INTO Token (user_id, token_string, expires_at) VALUES (%s, %s, %s)",
                            (user["user_id"], access_token, expires_at)
                        )
                        conn.commit()

                    # Set token in an HttpOnly cookie
                    response = make_response(
                        jsonify({
                            "token_string": access_token,
                            "user_data": {"user_id": user["user_id"], "username": user["username"], "customer_id": user["customer_id"]},
                            "message": "Login successful!",
                            "success": True
                        }), 200
                    )
                    response.set_cookie("jwt_token", access_token, httponly=True, secure=False, samesite="Strict", expires=expires_at)
                    return response
                else:
                    return jsonify({"message": "Invalid username or password"}), 401
        except Exception as e:
            return jsonify({"message": "Error during login: " + str(e)}), 500
        finally:
            if conn:
                conn.close()

    # Validate JWT Token Route
    @app.route("/api/auth/validate-token", methods=["GET"])
    def validate_token():
        token = request.cookies.get("jwt_token")
        if not token:
            return jsonify({"message": "Token not found in cookies"}), 400

        conn = None
        try:
            # Decode and validate the JWT token manually
            decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = decoded_token.get("identity")
            if not current_user:
                return jsonify({"message": "Invalid or missing JWT token"}), 401

            # Check if the token exists in the database and is valid
            conn = get_db_connection()
            with conn.cursor() as cursor:
                token_query = "SELECT * FROM Token WHERE token_string = %s AND expires_at > NOW() AND is_invalid = FALSE;"
                cursor.execute(token_query, (token,))

                valid_token = cursor.fetchone()
                if not valid_token:
                    return jsonify({"message": "Token is invalid or expired"}), 401

                return jsonify({
                    "message": "Token is valid",
                    "user_data": {
                        "user_id": current_user["user_id"],
                        "username": current_user["username"],
                        "customer_id": current_user["customer_id"]
                    }
                }), 200
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401
        except Exception as e:
            return jsonify({"message": "Error during token validation: " + str(e)}), 500
        finally:
            if conn:
                conn.close()

    # Refresh JWT Token Route
    @app.route("/api/auth/refresh-token", methods=["POST"])
    def refresh_token():
        old_token = request.cookies.get("jwt_token")
        if not old_token:
            return jsonify({"message": "Token not found in cookies"}), 400
        
        conn = None
        try:
            # Decode and validate the JWT token manually
            decoded_token = jwt.decode(old_token, SECRET_KEY, algorithms=["HS256"])
            current_user = decoded_token.get("identity")

            if not current_user:
                return jsonify({"message": "Invalid or missing JWT token"}), 401

            # Generate a new JWT token
            new_expires_at = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)  # Match the token's expiration time
            new_token = jwt.encode(
                {"identity" : {"user_id": current_user["user_id"], "username": current_user["username"], "customer_id": current_user["customer_id"]}, "exp" : new_expires_at},
                SECRET_KEY, algorithm="HS256")

            conn = get_db_connection()
            with conn.cursor() as cursor:
                # Replace the old token with the new one in the database
                delete_token_query = "DELETE FROM Token WHERE token_string = %s"
                cursor.execute(delete_token_query, (old_token,))

                insert_token_query = "INSERT INTO Token (user_id, token_string, expires_at) VALUES (%s, %s, %s)"
                cursor.execute(insert_token_query, (current_user["user_id"], new_token, new_expires_at))

                conn.commit()

                # Set the new token in the cookie
                response = make_response(jsonify({"message": "Token refreshed"}), 201)
                response.set_cookie("jwt_token", new_token, httponly=False, secure=False, samesite="Strict") #samesite="Lax"
                return response
        except Exception as e:
            return jsonify({"message": "Error refreshing token", "error": str(e)}), 500
        finally:
            if conn:
                conn.close()

    # Logout Route
    @app.route("/api/auth/logout", methods=["PUT"])
    def logout():
        token = request.cookies.get("jwt_token")
        if not token:
            return jsonify({"message": "No token found in cookies"}), 400

        conn = None
        try:
            # Mark the token as invalid in the database
            conn = get_db_connection()
            with conn.cursor() as cursor:
                cursor.execute("UPDATE Token SET is_invalid = TRUE WHERE token_string = %s", (token,))
                conn.commit()

            # Clear the token from the cookie
            response = make_response(jsonify({"message": "Logged out successfully", "success" : True}), 200)
            response.set_cookie("jwt_token", "", expires=0, httponly=True, secure=False, samesite="Strict")
            return response
        except Exception as e:
            return jsonify({"message": "Error during logout" + str(e), "error": str(e)}), 500
        finally:
            if conn:
                conn.close()

    # Get customer info by customer_id
    @app.route('/api/auth/customer/<int:customer_id>', methods=['GET'])
    def get_customer(customer_id):
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                # customer_id = request.args.get('customer_id')
                query = '''SELECT customer_id, first_name, last_name, 
                CONCAT(street_num,', ', street, ', ', unit, ', ', city, ', ', state, ', ', zip_code, ', ', country) AS billing_address
                FROM Customer JOIN Address ON Customer.address_id = Address.address_id 
                WHERE customer_id = %s;
                '''
                cursor.execute(query, (customer_id,)) 
                result = cursor.fetchone()
                if not result:
                    return jsonify([])
                return jsonify(result), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()