from flask import jsonify, request
import pymysql
from threading import Lock

def get_db_connection():
    config = {
        'host': 'localhost',
        'user': 'root',
        'password' : "Family",
        'database': 'project1',
        'charset': 'utf8mb4',
        'cursorclass': pymysql.cursors.DictCursor
    }
    return pymysql.connect(**config)

def view_configure_routes(app):
    
    # get daily usage by sID, and specific month, year
    @app.route('/api/getDailyUsageBySID/', methods=['GET'])
    def getDailyUsageBySID():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                sID = request.args.get('sID')
                Month = request.args.get('Month')
                Year = request.args.get('Year')
                query = """SELECT sID, DATE(eventTime) AS Day, SUM(eventValue) AS totalUsage
                FROM ServiceLocation NATURAL JOIN EnrolledDevice NATURAL JOIN EnrolledDeviceEvent NATURAL JOIN Event
                WHERE eventLabel = 'energy use' AND sID = %s AND MONTH(eventTime) = %s AND YEAR(eventTime) = %s
                GROUP BY sID, DATE(eventTime);"""
                cursor.execute(query, ( sID, Month,Year))
                result = cursor.fetchall()
                if not result:
                    return jsonify([])
                return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            if conn:
                conn.close()

    # get monthly usage by sID, and specific year
    @app.route('/api/getMonthlyUsageBySID/', methods=['GET'])
    def getMonthlyUsageBySID():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                sID = request.args.get('sID')
                Year = request.args.get('Year')
                query = """SELECT sID, MONTH(eventTime) AS Month, SUM(eventValue) AS totalUsage
                FROM ServiceLocation NATURAL JOIN EnrolledDevice NATURAL JOIN EnrolledDeviceEvent NATURAL JOIN Event
                WHERE eventLabel = 'energy use' AND sID = %s AND YEAR(eventTime) = %s
                GROUP BY sID, MONTH(eventTime);"""
                cursor.execute(query, ( sID, Year,))
                result = cursor.fetchall()
                if not result:
                    return jsonify([])
                return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            if conn:
                conn.close()

    # get yearly usage by sID, cID
    @app.route('/api/getYearlyUsageBySID/', methods=['GET'])
    def getYearlyUsageBySID():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                sID = request.args.get('sID')
                query = """SELECT sID, YEAR(eventTime) AS Year, SUM(eventValue) AS totalUsage
                FROM ServiceLocation NATURAL JOIN EnrolledDevice NATURAL JOIN EnrolledDeviceEvent NATURAL JOIN Event
                WHERE eventLabel = 'energy use' AND sID = %s 
                GROUP BY sID, YEAR(eventTime);"""
                cursor.execute(query, ( sID,))
                result = cursor.fetchall()
                if not result:
                    return jsonify([])
                return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            if conn:
                conn.close()
                
    # get energyprice
    @app.route('/api/getEnergyPrice/', methods=['GET'])
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
            return jsonify({'error': str(e)}), 500
        finally:
            if conn:
                conn.close()
    
    # get energyprice by sID
    @app.route('/api/getEnergyPriceBySID/', methods=['GET'])
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
            return jsonify({'error': str(e)}), 500
        finally:
            if conn:
                conn.close()
    
    # get service location by cID (inactive and active)
    @app.route('/api/getServiceLocation/', methods=['GET'])
    def getServiceLocation():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                cID = request.args.get('cID')
                query = """SELECT * FROM ServiceLocation WHERE cID = %s;"""
                cursor.execute(query, (cID,))
                result = cursor.fetchall()
                if not result:
                    return jsonify([])
                return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            if conn:
                conn.close()
    
    # get service location by cID (active)
    @app.route('/api/getActiveServiceLocation/', methods=['GET'])
    def getActiveServiceLocation():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                cID = request.args.get('cID')
                query = """SELECT * FROM ServiceLocation WHERE cID = %s AND serviceStatus = 'active';"""
                cursor.execute(query, (cID,))
                result = cursor.fetchall()
                if not result:
                    return jsonify([])
                return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            if conn:
                conn.close()
    
    # get enrolled device by sID
    @app.route('/api/getEnrolledDevice/', methods=['GET'])
    def getEnrolledDevice():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                sID = request.args.get('sID')
                query = """SELECT * FROM EnrolledDevice WHERE sID = %s;"""
                cursor.execute(query, (sID,))
                result = cursor.fetchall()
                if not result:
                    return jsonify([])
                return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            if conn:
                conn.close()
    
    # get enrolled device by sID (enrolled)
    @app.route('/api/getEnrolledDeviceEnrolled/', methods=['GET'])
    def getEnrolledDeviceEnrolled():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                sID = request.args.get('sID')
                query = """SELECT * FROM EnrolledDevice WHERE sID = %s AND enrollStatus = 'enrolled';"""
                cursor.execute(query, (sID,))
                result = cursor.fetchall()
                if not result:
                    return jsonify([])
                return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            if conn:
                conn.close()
                
    # get daily usage of enrolled device by sID, cID, and specific month, year
    @app.route('/api/getDailyUsageOfEnrolledDevice/', methods=['GET'])
    def getDailyUsageOfEnrolledDevice():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                cID = request.args.get('cID')
                sID = request.args.get('sID')
                Month = request.args.get('Month')
                Year = request.args.get('Year')
                query = """SELECT sID, edID, DATE(eventTime) AS Day, SUM(eventValue) AS totalUsage
                FROM ServiceLocation NATURAL JOIN EnrolledDevice NATURAL JOIN EnrolledDeviceEvent NATURAL JOIN Event
                WHERE eventLabel = 'energy use' AND cID = %s AND sID = %s AND MONTH(eventTime) = %s AND YEAR(eventTime) = %s
                GROUP BY sID, edID, DATE(eventTime);"""
                cursor.execute(query, (cID, sID, Month,Year))
                result = cursor.fetchall()
                if not result:
                    return jsonify([])
                return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            if conn:
                conn.close()
                
    # get monthly usage of enrolled device by sID, cID, and specific year
    @app.route('/api/getMonthlyUsageOfEnrolledDevice/', methods=['GET'])
    def getMonthlyUsageOfEnrolledDevice():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                cID = request.args.get('cID')
                sID = request.args.get('sID')
                Year = request.args.get('Year')
                query = """SELECT sID, edID, MONTH(eventTime) AS Month, SUM(eventValue) AS totalUsage
                FROM ServiceLocation NATURAL JOIN EnrolledDevice NATURAL JOIN EnrolledDeviceEvent NATURAL JOIN Event
                WHERE eventLabel = 'energy use' AND cID = %s AND sID = %s AND YEAR(eventTime) = %s
                GROUP BY sID, edID, MONTH(eventTime);"""
                cursor.execute(query, (cID, sID, Year,))
                result = cursor.fetchall()
                if not result:
                    return jsonify([])
                return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            if conn:
                conn.close()
    
    # get yearly usage of enrolled device by sID, cID
    @app.route('/api/getYearlyUsageOfEnrolledDevice/', methods=['GET'])
    def getYearlyUsageOfEnrolledDevice():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                cID = request.args.get('cID')
                sID = request.args.get('sID')
                query = """SELECT sID, enDevID, YEAR(eventTime) AS Year, SUM(eventValue) AS totalUsage
                FROM ServiceLocation NATURAL JOIN EnrolledDevice NATURAL JOIN EnrolledDeviceEvent NATURAL JOIN Event
                WHERE eventLabel = 'energy use' AND cID = %s AND sID = %s 
                GROUP BY sID, enDevID, YEAR(eventTime);"""
                cursor.execute(query, (cID, sID,))
                result = cursor.fetchall()
                if not result:
                    return jsonify([])
                return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally: 
            if conn:
                conn.close()