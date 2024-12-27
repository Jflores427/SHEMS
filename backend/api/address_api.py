import pymysql
from flask import jsonify, request
from threading import Lock

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

address_lock = Lock()

# Gets an address from request data (Inserts a new address, if not found)
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
                    addressID = cursor.lastrowid
                    conn.commit()
                    return jsonify({'addressID': addressID}), 200
                addressID = result[0][0]
                return jsonify({'addressID':addressID,}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()

# Updates billing address for a customer
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
                conn.commit()
                return jsonify({'addressID': billing_address_id, 'success': True}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()

# Gets an address for a customer
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
        return jsonify({'message': str(e)}), 500
    finally:
        if conn:
            conn.close()

def address_configure_routes(app):
    app.add_url_rule('/api/handleAddress', view_func=handleAddress, methods=['POST'])
    app.add_url_rule('/api/updateBillingAddress', view_func=updateBillingAddress, methods=['PUT'])
    app.add_url_rule('/api/getBillingAddress', view_func=getBillingAddress, methods=['GET'])
   