import datetime
import os
import jwt
import pymysql
from flask import jsonify, make_response, request, send_from_directory
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from threading import Lock
from werkzeug.security import generate_password_hash, check_password_hash

UPLOAD_FOLDER = 'uploads/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

SECRET_KEY = os.getenv("JWT_SECRET_KEY")

def get_db_connection():
    config = {
        'host': 'localhost',
        'user': 'root',
        'database': 'shems_test1',
        'charset': 'utf8mb4',
        'cursorclass': pymysql.cursors.DictCursor
    }
    return pymysql.connect(**config)

def customer_service_configure_routes(app):
    
    @app.route('/api/register', methods=['POST'])
    def register():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                data = request.get_json()
                username = data['username']
                password = data['password']
                hashed_password = generate_password_hash(password)
                response, status_code = addCustomer()
                if status_code !=200:
                    print("hello")
                    return response, status_code
                else:
                    print(response.get_json())
                    customerID = response.get_json()['customerID']
                register_query = """INSERT INTO User (username, password_hash, cID) VALUES (%s, %s, %s)"""
                cursor.execute(register_query, (username, hashed_password, customerID,))
                conn.commit()
                return jsonify({'message': 'Register successfully!',
                                'cID': customerID}), 200
        except Exception as e:
            # conn.rollback()
            return jsonify({'error': str(e)}), 500
        finally:
            if conn:
                conn.close()
                
    # check if username exists
    @app.route('/api/checkUsername', methods=['GET'])
    def checkUsername():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                username = request.args.get('username')
                query = """SELECT * FROM User WHERE username = %s"""
                cursor.execute(query, (username,))
                user = cursor.fetchone()
                if user:
                    return jsonify({'isExist': True}), 200
                else:
                    return jsonify({'isExist': False}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            if conn:
                conn.close()
        
    @app.route("/api/login", methods=["POST"])
    def login():
        conn = None
        try:
            # Get username and password from the request body
            data = request.get_json()
            username = data["username"]
            password = data["password"]

            # Get user from the database
            conn = get_db_connection()
            with conn.cursor() as cursor:
                cursor.execute("SELECT * FROM User WHERE username = %s", (username,))
                user = cursor.fetchone()

            if user and check_password_hash(user["password_hash"], password):
                # Generate JWT token
                expires_at = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)  # Match the token's expiration time
                print(expires_at)
                access_token = jwt.encode(
                    {"identity" : {"uID": user["uID"], "username": user["username"], "cID": user["cID"]}},
                    SECRET_KEY, algorithm="HS256"
                )

                # Store token in the database
                with conn.cursor() as cursor:
                    cursor.execute(
                        "INSERT INTO Token (uID, token_string, expires_at) VALUES (%s, %s, %s)",
                        (user["uID"], access_token, expires_at)
                    )
                    conn.commit()

                # Set token in an HttpOnly cookie
                response = make_response(
                    jsonify({
                        "token_string": access_token,
                        "userData": {"uID": user["uID"], "username": user["username"], "cID": user["cID"]},
                        "message": "Login successful!",
                    }), 200
                )
                response.set_cookie("jwtToken", access_token, httponly=True, secure=False, samesite="Strict", expires=expires_at)
                return response

            else:
                return jsonify({"message": "Invalid username or password"}), 401

        except Exception as e:
            return jsonify({"message": "Error during login: " + str(e), "error": str(e)}), 500
        finally:
            if conn:
                conn.close()

    @app.route("/api/validate-token", methods=["POST"])
    def validate_token():
        token = request.cookies.get("jwtToken")

        if not token:
            return jsonify({"message": "Token not found in cookies"}), 400

        print(token)

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
                cursor.execute("""
                    SELECT * FROM Token WHERE token_string = %s AND expires_at > NOW() AND is_invalid = FALSE
                """, (token,))
                valid_token = cursor.fetchone()

                if not valid_token:
                    return jsonify({"message": "Token is invalid or expired"}), 401

                # Token is valid, return user data
                return jsonify({
                    "message": "Token is valid",
                    "userData": {
                        "uID": current_user["uID"],
                        "username": current_user["username"],
                        "cID": current_user["cID"]
                    }
                }), 200

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401
        except Exception as e:
            return jsonify({"message": "Error during token validation: " + str(e), "error": str(e)}), 500
        finally:
            if conn:
                conn.close()

    @app.route("/api/refresh-token", methods=["POST"])
    @jwt_required(refresh=True, locations=['cookies'])
    def refresh_token():
        conn = None
        try:
            current_user = get_jwt_identity()
            old_token = request.cookies.get("jwtToken")

            # Generate a new JWT
            new_token = create_access_token(identity=current_user)
            new_expires_at = datetime.utcnow() + datetime.timedelta(hours=1)

            conn = get_db_connection()
            with conn.cursor() as cursor:
                # Replace the old token with the new one in the database
                cursor.execute("DELETE FROM token WHERE token_string = %s", (old_token,))
                cursor.execute("INSERT INTO token (uID, token_string, expires_at) VALUES (%s, %s, %s)", 
                            (current_user["uID"], new_token, new_expires_at))
                conn.commit()

                # Set the new token in the cookie
                response = make_response(jsonify({"message": "Token refreshed"}))
                response.set_cookie("jwtToken", new_token, httponly=False, secure=False, samesite="Lax")
                return response

        except Exception as e:
            return jsonify({"message": "Error refreshing token", "error": str(e)}), 500

        finally:
            if conn:
                conn.close()

    @app.route("/api/logout", methods=["POST"])
    def logout():
        token = request.cookies.get("jwtToken")

        if not token:
            return jsonify({"message": "No token found in cookies"}), 400

        conn = None
        try:
            # Remove the token from the database (mark it as invalid)
            conn = get_db_connection()
            with conn.cursor() as cursor:
                cursor.execute("UPDATE Token SET is_invalid = TRUE WHERE token_string = %s", (token,))
                conn.commit()

            # Clear the token from the cookie
            response = make_response(jsonify({"message": "Logged out successfully"}))
            response.set_cookie("jwtToken", "", expires=0, httponly=True, secure=False, samesite="Strict")
            return response

        except Exception as e:
            return jsonify({"message": "Error during logout" + str(e), "error": str(e)}), 500
        finally:
            if conn:
                conn.close()

    # get customer info by cID
    @app.route('/api/getCustomer', methods=['GET'])
    def getCustomer():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                cID = request.args.get('cID')
                query = '''SELECT C.cID, C.cFirstName, C.cLastName, 
                CONCAT(A.streetNum,', ', A.street, ', ', A.unit, ', ', A.city, ', ', A.state, ', ', A.zipcode, ', ', A.country) AS billingAddress
                FROM customer C JOIN address A ON C.billingAddressID=A.addressID 
                WHERE C.cID = %s;'''
                cursor.execute(query, (cID,)) # using prepared statement to prevent SQL injection
                result = cursor.fetchall()
                if not result:
                    return jsonify([])
                return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            if conn:
                conn.close()
                
    # add a new address if not exist, and return addressID
    address_lock = Lock()
    @app.route('/api/handleAddress', methods=['POST'])
    def handleAddress():
        with address_lock:
            conn = None
            try:
                conn = get_db_connection()
                with conn.cursor() as cursor:
                    data = request.get_json()
                    print(data)
                    streetNum = data['streetNum']
                    street = data['street']
                    unit = data['unit']
                    city = data['city']
                    state = data['state']
                    zipcode = data['zipcode']
                    country = data['country']
                    query = """SELECT * FROM address 
                    WHERE streetNum = %s 
                    AND street = %s 
                    AND unit = %s 
                    AND city = %s 
                    AND state = %s 
                    AND zipcode = %s 
                    AND country = %s;"""
                    cursor.execute(query, (streetNum, street, unit, city, state, zipcode, country,))
                    result = cursor.fetchall()
                    if not result:
                        addQuery = """INSERT INTO address (streetNum, street, unit, city, state
                        , zipcode, country)
                        VALUES (%s, %s, %s, %s, %s, %s, %s);"""
                        cursor.execute(addQuery, (streetNum, street, unit, city, state, zipcode, country,))
                        conn.commit()
                        addressID = cursor.lastrowid
                        return jsonify({'addressID': addressID}), 200
                    addressID = result[0][0]
                    print(addressID)
                    return jsonify({'addressID':addressID,}), 200
                    
            except Exception as e:
                # conn.rollback()
                return jsonify({'error': str(e) + "Hit"}), 500
            finally:
                if conn:
                    conn.close()

    @app.route('/api/updateBillingAddress', methods=['PUT'])
    def updateBillingAddress():
        with address_lock:
            conn = None
            try:
                conn = get_db_connection()
                with conn.cursor() as cursor:
                    cID = request.args.get('cID')
                    data = request.get_json()
                    query = """SELECT billingAddressID, streetNum, street, unit, city, state
                    , zipcode, country 
                    FROM customer JOIN address ON customer.billingAddressID = address.addressID 
                    WHERE cID = %s;
                    """
                    cursor.execute(query, (cID,))
                    result = cursor.fetchall()
                    print(jsonify(result))
                    if not result or len(result) == 0:
                        return jsonify([])

                    billing_address_id = result[0]['billingAddressID']
                    street_num = data['streetNum']
                    street = data['street']
                    unit = data['unit']
                    city = data['city']
                    state = data['state']
                    zipcode = data['zipcode']
                    country = data['country']

                    query = """
                    UPDATE address
                    SET streetNum = %s, 
                    street = %s, 
                    unit = %s,
                    city = %s, 
                    state = %s, 
                    zipcode = %s, 
                    country = %s
                    WHERE addressID = %s;
                    """
                    cursor.execute(query, (street_num, street, unit, city, state, zipcode, country, billing_address_id))
                    result = cursor.fetchall()
                    print(jsonify(result))
                    conn.commit()
                    return jsonify({'addressID': billing_address_id, 'success': True}), 200
                    
            except Exception as e:
                conn.rollback()
                return jsonify({'error': str(e) + "- Hit"}), 500
            finally:
                if conn:
                    conn.close()

    # get Billing Address of Customer
    @app.route('/api/getBillingAddress', methods=['GET'])
    def getBillingAddress():
            conn = None
            try:
                conn = get_db_connection()
                with conn.cursor() as cursor:
                    cID = request.args.get('cID')
                    query = """SELECT billingAddressID, streetNum, street, unit, city, state
                    , zipcode, country 
                    FROM customer JOIN address ON customer.billingAddressID = address.addressID 
                    WHERE cID = %s;
                    """
                    cursor.execute(query, (cID,))
                    result = cursor.fetchall()
                    if not result:
                        return jsonify([])
                    return jsonify(result)
            except Exception as e:
                conn.rollback()
                return jsonify({'error': str(e)}), 500
            finally:
                if conn:
                    conn.close()

    # Start a new customer
    addCustomer_lock = Lock()
    @app.route('/api/addCustomer', methods=['POST'])
    def addCustomer():
        with addCustomer_lock:
            conn = None
            try:
                conn = get_db_connection()
                with conn.cursor() as cursor:
                    data = request.get_json()
                    cFisrtName = data['cFirstName']
                    cLastName = data['cLastName']

                    response, status_code = handleAddress()
                    if status_code !=200:
                        print("double hello")
                        return response, status_code
                    else:
                        addressID = response.get_json()['addressID']
                    
                    query = """INSERT INTO customer (cFirstName, cLastName,cProfileURL, billingAddressID)
                    VALUES (%s, %s, %s, %s);"""
                    cursor.execute(query, (cFisrtName, cLastName, "", addressID,))
                    conn.commit()
                    customerID = cursor.lastrowid
                    return jsonify({'customerID': customerID}), 200
            except Exception as e:
                conn.rollback()
                return jsonify({'error': str(e)}), 500
            finally:
                if conn:
                    conn.close()

    # Start a new service location
    addServiceLocation_lock = Lock()
    @app.route('/api/addServiceLocation', methods=['POST'])
    def addServiceLocation():
        with addServiceLocation_lock:
            conn = None
            try:
                conn = get_db_connection()
                with conn.cursor() as cursor:
                    data=request.get_json()
                    cID = data['cID']
                    startDate = data['startDate']
                    squareFt = data['squareFt']
                    bedroomNum = data['bedroomNum']
                    occupantNum = data['occupantNum']
                    serviceStatus = data['serviceStatus']
                    response, status_code = handleAddress()
                    if status_code !=200:
                        return response, status_code
                    else:
                        addressID = response.get_json()['addressID']

                    query = """INSERT INTO ServiceLocation (cID, serviceAddressID, startDate, squareFt, 
                    bedroomNum, occupantNum, serviceStatus)
                    VALUES (%s, %s, %s, %s, %s, %s, %s);"""
                    cursor.execute(query, (cID, addressID, startDate, squareFt, 
                                           bedroomNum, occupantNum, serviceStatus))
                    conn.commit()
                    return jsonify({'message': 'service location added'}), 200
            except Exception as e:
                conn.rollback()
                return jsonify({'error': str(e)}), 500
            finally:
                if conn:
                    conn.close()
                    
    # set service location status
    @app.route('/api/setServiceLocationStatus', methods=['POST'])
    def setServiceLocationStatus():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                data=request.get_json()
                serviceLocationID = data['sID']
                newServiceStatus = data['serviceStatus']
                query = """UPDATE ServiceLocation SET serviceStatus = %s WHERE sID = %s;"""
                cursor.execute(query, (newServiceStatus, serviceLocationID,))
                conn.commit()
                return jsonify({'message': 'service location status set to '+newServiceStatus}), 200
        except Exception as e:
            conn.rollback()
            return jsonify({'error': str(e)}), 500
        finally:
            if conn:
                conn.close()

 # delete service location
    @app.route('/api/deleteServiceLocation', methods=['DELETE'])
    def deleteServiceLocation():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                data=request.get_json()
                print(data)
                serviceLocationID = data['sID']
                query = """DELETE FROM ServiceLocation WHERE sID = %s;"""
                cursor.execute(query, (serviceLocationID,))
                conn.commit()
                return jsonify({'message': f'service location {serviceLocationID} deleted'}), 200
        except Exception as e:
            conn.rollback()
            return jsonify({'error': str(e)}), 500
        finally:
            if conn:
                conn.close()
                
                
    # enroll a new device on sID, devID, enDevName
    @app.route('/api/enrollDevice', methods=['POST'])
    def enrollDevice():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                data=request.get_json()
                sID = data['sID']
                devID = data['devID']
                enDevName=data['enDevName']
                query = """INSERT INTO enrolledDevice (enDevName, devID, sID, enrolledStatus) 
                VALUES (%s, %s, %s, 'enabled');"""
                cursor.execute(query, (enDevName,devID, sID, ))
                enDevID=cursor.lastrowid
                conn.commit()
                return jsonify({'message': 'new device enrolled',
                                'enDevID':enDevID,
                                'enDevName':enDevName,
                                'devID':devID,
                                'sID':sID
                                }), 200
        except Exception as e:
            conn.rollback()
            return jsonify({'error': str(e)}), 500
        finally:
            if conn:
                conn.close()
                
    # set enrolled device status
    @app.route('/api/setEnrolledDeviceStatus', methods=['POST'])
    def setEnrolledDeviceStatus():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                data=request.get_json()
                enDevID = data['enDevID']
                newEnrolledStatus = data['enrolledStatus']
                query = """UPDATE enrolledDevice SET enrolledStatus = %s WHERE enDevID = %s;"""
                cursor.execute(query, (newEnrolledStatus, enDevID,))
                conn.commit()
                return jsonify({'message': 'enrolled device status set to '+newEnrolledStatus}), 200
        except Exception as e:
            conn.rollback()
            return jsonify({'error': str(e)}), 500
        finally:
            if conn:
                conn.close()
    
    # delete enrolled device
    @app.route('/api/deleteEnrolledDevice', methods=['DELETE'])
    def deleteEnrolledDevice():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                data =request.get_json()
                enDevID = data['enDevID']
                query = """DELETE FROM EnrolledDevice WHERE enDevID = %s;"""
                cursor.execute(query, (enDevID,))
                conn.commit()
                return jsonify({'message': f'Enrolled Device {enDevID} deleted'}), 200
        except Exception as e:
            conn.rollback()
            return jsonify({'error': str(e)}), 500
        finally:
            if conn:
                conn.close()
    
    @app.route('/api/setUploadImage', methods=['PUT'])
    def set_upload_image():
        try:
            if 'file' not in request.files:
                return jsonify({'error': 'No file sent'}), 400
            
            cID = request.form.get('cID')
            file = request.files['file']
            
            if not file or file.filename == '':
                return jsonify({'error': 'No selected file'}), 400
            
            filename = f"{cID}_{file.filename}"
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)
            
            conn = get_db_connection()
            with conn.cursor() as cursor:
                query = """UPDATE Customer SET cProfileURL = %s WHERE cID = %s"""
                cursor.execute(query, (filepath, cID))
                conn.commit()
            return jsonify({'message': 'Image uploaded successfully', 'cProfileURL': filepath}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    ## Dont touch this one path wise
    @app.route("/api/getUploadImage/", methods=['GET'])
    def get_upload_image():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                # Get and validate cID
                cID = request.args.get("cID")
                if not cID:
                    return jsonify({'message': 'Missing cID parameter'}), 400

                # Query the database
                query = """SELECT cProfileURL FROM Customer WHERE cID = %s;"""
                cursor.execute(query, (cID,))
                result = cursor.fetchone()
                if not result:
                    return jsonify({'message': f'No customer found with cID={cID}'}), 404

                cProfileURL = result['cProfileURL']
                return jsonify({
                    'cProfileURL': str(cProfileURL),
                    'message': f'Image with path {cProfileURL} retrieved successfully'
                }), 200

        except Exception as e:
            print("Error:", str(e))
            return jsonify({'error': str(e)}), 500

        finally:
            if conn:
                conn.close()

    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory(UPLOAD_FOLDER, filename)
    
    