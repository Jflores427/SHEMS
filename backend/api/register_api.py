import pymysql
from flask import jsonify, request
from threading import Lock
from werkzeug.security import generate_password_hash
from api.address_api import handleAddress

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

def register_configure_routes(app):
    # Registers a new user with a <username> and a <password>
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
                if status_code != 200:
                    return response, status_code
                else:
                    customerID = response.get_json()['customerID']
                register_query = """INSERT INTO User (username, password_hash, cID) VALUES (%s, %s, %s)"""
                cursor.execute(register_query, (username, hashed_password, customerID,))
                conn.commit()
                return jsonify({'message': 'Register successfully!',
                                'cID': customerID}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()
                
    # Checks if a <username> exists
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
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()

    # Adds a new customer
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
                return jsonify({'message': str(e)}), 500
            finally:
                if conn:
                    conn.close()
    
    