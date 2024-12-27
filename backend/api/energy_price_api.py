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
    @app.route('/api/getEnergyPrice', methods=['GET'])
    def getEnergyPrice():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                query = """SELECT * FROM EnergyPrice;"""
                cursor.execute(query)
                result = cursor.fetchall()
                if not result:
                    return jsonify([])
                return jsonify(result)
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()
    
    # Get energy price by <sID>
    @app.route('/api/getEnergyPriceBySID', methods=['GET'])
    def getEnergyPriceBySID():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                sID = request.args.get('sID')
                query = """SELECT SL.sID, EP.zipcode, EP.startHourTime, EP.priceKWH 
                FROM EnergyPrice EP JOIN Address A ON EP.zipcode = A.zipcode
                JOIN ServiceLocation SL ON A.addressID = SL.serviceAddressID 
                WHERE sID = %s;"""
                cursor.execute(query, (sID,))
                result = cursor.fetchall()
                if not result:
                    return jsonify([])
                return jsonify(result)
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()
    
    
                
   
                
    