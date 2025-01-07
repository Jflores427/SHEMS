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
def post_handle_address():
    with address_lock:
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                data = request.get_json()
                address_type = data["address_type"]
                street_num = data['street_num']
                street = data['street']
                unit = data['unit']
                city = data['city']
                state = data['state']
                zip_code = data['zip_code']
                country = data['country']
                query = """SELECT address_id FROM address 
                WHERE address_type = %s 
                AND street_num = %s 
                AND street = %s 
                AND unit = %s 
                AND city = %s 
                AND state = %s 
                AND zip_code = %s 
                AND country = %s;"""
                cursor.execute(query, (address_type, street_num, street, unit, city, state, zip_code, country))
                result = cursor.fetchone()
                if not result:
                    addQuery = """INSERT INTO address (address_type, street_num, street, unit, city, state, zip_code, country)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s);"""
                    cursor.execute(addQuery, (address_type, street_num, street, unit, city, state, zip_code, country))
                    address_id = cursor.lastrowid
                    conn.commit()
                    return jsonify({'address_id': address_id}), 201
                address_id = result['address_id']
                return jsonify({'address_id': address_id, 'success': True}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()

# Updates billing address for a customer
def put_billing_customer(customer_id):
    with address_lock:
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                # customer_id = request.args.get('customer_id')
                data = request.get_json()
                query = """SELECT address_id
                FROM Customer JOIN Address ON Customer.address_id = Address.address_id 
                WHERE customer_id = %d
                AND address_type = 'billing';
                """
                cursor.execute(query, (customer_id,))
                result = cursor.fetchone()
                if not result or len(result) == 0:
                    return jsonify([])

                address_id = result['address_id']
                street_num = data['street_num']
                street = data['street']
                unit = data['unit']
                city = data['city']
                state = data['state']
                zip_code = data['zip_code']
                country = data['country']

                query = """
                UPDATE Address
                SET street_num = %s, 
                street = %s, 
                unit = %s,
                city = %s, 
                state = %s, 
                zip_code = %s, 
                country = %s
                WHERE address_id = %s
                """
                cursor.execute(query, (street_num, street, unit, city, state, zip_code, country, address_id))
                conn.commit()
                return jsonify({'address_id': address_id, 'success': True}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()

# Gets an address for a customer
def get_billing_customer(customer_id):
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            # customer_id = request.args.get('customer_id')
            query = """SELECT address_id, street_num, street, unit, city, state, zip_code, country 
            FROM Customer JOIN Address ON Customer.address_id = Address.address_id 
            WHERE customer_id = %d
            AND address_type = 'billing';
            """
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

def address_configure_routes(app):
    app.add_url_rule('/api/addresses/handle-address', view_func = post_handle_address, methods=['POST'])
    app.add_url_rule('/api/addresses/billing-customer/<int:customer_id>', view_func = put_billing, methods=['PUT'])
    app.add_url_rule('/api/addresses/billing-customer/<int:customer_id>', view_func = get_billing, methods=['GET'])
   