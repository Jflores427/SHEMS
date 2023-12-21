from flask import jsonify, request
import pymysql
from threading import Lock
from werkzeug.security import generate_password_hash, check_password_hash

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
    
    @app.route('/api/register/', methods=['POST'])
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
                    return response, status_code
                else:
                    customerID = response.get_json()['customerID']
                register_query = """INSERT INTO User (username, password_hash, cID) VALUES (%s, %s, %s)"""
                cursor.execute(register_query, (username, hashed_password, customerID,))
                conn.commit()
                return jsonify({'message': 'Register successfully!',
                                'cID': customerID}), 200
        except Exception as e:
            conn.rollback()
            return jsonify({'error': str(e)}), 500
        finally:
            if conn:
                conn.close()
                
    # check if username exists
    @app.route('/api/checkUsername/', methods=['GET'])
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
        
    
    @app.route('/api/login/', methods=['POST'])
    def login():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                data = request.get_json()
                username = data['username']
                password = data['password']
                login_query = """SELECT * FROM User WHERE username = %s"""
                cursor.execute(login_query, (username,))
                user = cursor.fetchone()
                if user:
                    if check_password_hash(user['password_hash'], password):
                        return jsonify({'message': 'Login successfully!', 
                                        'username': user['username'], 'cID': user['cID'],}),200
                    else:
                        return jsonify({'message': 'Wrong password!'}) , 401
                else:
                    return jsonify({'message': 'Username does not exist!'}), 401
        except Exception as e:
            return jsonify({'error': str(e),}), 500
        finally:
            if conn:
                conn.close()
    
    # get customer info by cID
    @app.route('/api/getCustomer/', methods=['GET'])
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
    @app.route('/api/handleAddress/', methods=['POST'])
    def handleAddress():
        with address_lock:
            conn = None
            try:
                conn = get_db_connection()
                with conn.cursor() as cursor:
                    data = request.get_json()
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
                    return jsonify({'addressID':addressID,}), 200
                    
            except Exception as e:
                conn.rollback()
                return jsonify({'error': str(e) + "Hit"}), 500
            finally:
                if conn:
                    conn.close()

    # get Billing Address of Customer
    @app.route('/api/getBillingAddress/', methods=['GET'])
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
                    print(result)
                    if not result:
                        return jsonify([])
                    addressInfo = result
                    print(addressInfo[0])
                    # {'addressID': addressInfo['billingAddress'],
                    #                 'streetNum' : addressInfo['streetNum'],
                    #                 'street' : addressInfo['street'],
                    #                 'unit' : addressInfo['unit'],
                    #                 'city' : addressInfo['city'],
                    #                 'state' : addressInfo['state'],
                    #                 'zipcode' : addressInfo['zipcode'],
                    #                 'country' : addressInfo['country'],
                    #                 }
                    return jsonify(result)
            except Exception as e:
                conn.rollback()
                return jsonify({'error': str(e)}), 500
            finally:
                if conn:
                    conn.close()

    # Start a new customer
    addCustomer_lock = Lock()
    @app.route('/api/addCustomer/', methods=['POST'])
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
                        return response, status_code
                    else:
                        addressID = response.get_json()['addressID']
                    
                    query = """INSERT INTO customer (cFirstName, cLastName, billingAddressID)
                    VALUES (%s, %s, %s);"""
                    cursor.execute(query, (cFisrtName, cLastName, addressID,))
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
    @app.route('/api/addServiceLocation/', methods=['POST'])
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
    @app.route('/api/setServiceLocationStatus/', methods=['POST'])
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
                
                
                
    # enroll a new device on sID, devID, enDevName
    @app.route('/api/enrollDevice/', methods=['POST'])
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
    @app.route('/api/setEnrolledDeviceStatus/', methods=['POST'])
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
    