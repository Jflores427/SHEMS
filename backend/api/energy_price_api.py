from flask import jsonify, request
import pymysql
from threading import Lock

def get_db_connection():
    config = {
        'host': 'localhost',
        'user': 'root',
        'database': 'shems_test1',
        'charset': 'utf8mb4',
        'cursorclass': pymysql.cursors.DictCursor
    }
    return pymysql.connect(**config)

def energy_price_configure_routes(app):
    # Get energy prices
    @app.route('/api/energy-price', methods=['GET'])
    def get_energy_price():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                query = """SELECT * FROM EnergyPrice;"""
                cursor.execute(query)
                result = cursor.fetchall()
                if not result:
                    return jsonify([]), 204
                return jsonify(result), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()
    
    # Get energy price by <service_location_id>
    @app.route('/api/energy-price/<int:service_location_id>', methods=['GET'])
    def get_energy_price_by_service(service_location_id):
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                # service_location_id = request.args.get('service_location_id')
                query = """SELECT SL.service_location_id, EP.zipcode, EP.startHourTime, EP.priceKWH 
                FROM EnergyPrice EP 
                JOIN Address A ON EP.zipcode = A.zipcode
                JOIN ServiceLocation SL ON A.addressID = SL.serviceAddressID 
                WHERE service_location_id = %s;"""
                cursor.execute(query, (service_location_id,))
                result = cursor.fetchall()
                if not result:
                    return jsonify([]), 204
                return jsonify(result), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()
    
    
                
   
                
    