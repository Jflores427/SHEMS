import pymysql
from flask import jsonify, request

def get_db_connection():
    config = {
        'host': 'localhost',
        'user': 'root',
        'database': 'shems_test1',
        'charset': 'utf8mb4',
        'cursorclass': pymysql.cursors.DictCursor
    }
    return pymysql.connect(**config)

def feed_configure_routes(app):
    # Get monthly usage of every year and every service location by <cID>
    @app.route('/api/getMonthlyUsageByCID', methods=['GET'])
    def getMonthlyUsageByCID():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                cID = request.args.get('cID')
                query = """
                SELECT cID, sID, YEAR(eventTime) AS Year,MONTH(eventTime) AS Month, 
                SUM(eventValue) AS totalUsage
                FROM ServiceLocation 
                NATURAL JOIN EnrolledDevice 
                NATURAL JOIN EnrolledDeviceEvent 
                NATURAL JOIN Event
                WHERE eventLabel = 'energy use' 
                AND cID = %s 
                GROUP BY cID, sID,YEAR(eventTime) , MONTH(eventTime)
                ORDER BY sID,Year,Month;
                """
                cursor.execute(query, ( cID,))
                result = cursor.fetchall()
                if not result:
                    return jsonify([])
                return jsonify(result)
        except Exception as e:
            return jsonify({'message': str(e)}), 500 
        finally:
            if conn:
                conn.close()
                
    # Get the total monthly cost of all service locations by <cID>
    @app.route('/api/getMonthlyCostByCID', methods=['GET'])
    def getMonthlyCostByCID():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                cID = request.args.get('cID')
                query = """
                SELECT cID, sID, YEAR(eventTime) AS Year,MONTH(eventTime) AS Month, 
                SUM(eventValue*priceKWH) AS totalCost
                FROM ServiceLocation SL
                JOIN Address A ON SL.serviceAddressID = A.addressID
                NATURAL JOIN EnrolledDevice 
                NATURAL JOIN EnrolledDeviceEvent
                NATURAL JOIN Event
                JOIN EnergyPrice EP
                WHERE eventLabel = 'energy use' 
                AND cID = %s 
                AND A.zipcode = EP.zipcode
                AND HOUR(eventTime) = EP.startHourTime
                GROUP BY cID, sID,YEAR(eventTime) , MONTH(eventTime)
                ORDER BY sID,Year,Month;
                """
                cursor.execute(query, ( cID,))
                result = cursor.fetchall()
                if not result:
                    return jsonify([])
                return jsonify(result)
        except Exception as e:
            return jsonify({'message': str(e)}), 500 
        finally:
            if conn:
                conn.close()