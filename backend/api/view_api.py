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
                query = """
                SELECT sID, DATE(eventTime) AS Day, SUM(eventValue) AS totalUsage
                FROM ServiceLocation NATURAL JOIN EnrolledDevice 
                NATURAL JOIN EnrolledDeviceEvent 
                NATURAL JOIN Event
                WHERE eventLabel = 'energy use' 
                AND sID = %s 
                AND MONTH(eventTime) = %s 
                AND YEAR(eventTime) = %s
                GROUP BY sID, DATE(eventTime)
                ORDER BY Day;
                """
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
                query = """
                SELECT sID, MONTH(eventTime) AS Month, SUM(eventValue) AS totalUsage
                FROM ServiceLocation 
                NATURAL JOIN EnrolledDevice 
                NATURAL JOIN EnrolledDeviceEvent 
                NATURAL JOIN Event
                WHERE eventLabel = 'energy use' 
                AND sID = %s 
                AND YEAR(eventTime) = %s
                GROUP BY sID, MONTH(eventTime)
                ORDER BY Month;
                """
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
                
    # get monthly usage of all year and all sID by cID
    @app.route('/api/getMonthlyUsageByCID/', methods=['GET'])
    def getMonthlyUsageByCID():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                cID = request.args.get('cID')
                query = """
                SELECT cID, sID, YEAR(eventTime) AS Year,MONTH(eventTime) AS Month, SUM(eventValue) AS totalUsage
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
            return jsonify({'error': str(e)}), 500 
        finally:
            if conn:
                conn.close()
                
    # get the total monthly cost of all service locations by cID
    @app.route('/api/getMonthlyCostByCID/', methods=['GET'])
    def getMonthlyCostByCID():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                cID = request.args.get('cID')
                query = """
                SELECT cID, sID, YEAR(eventTime) AS Year,MONTH(eventTime) AS Month, SUM(eventValue*priceKWH) AS totalCost
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
            return jsonify({'error': str(e)}), 500 
        finally:
            if conn:
                conn.close()

    # get yearly usage by sID
    @app.route('/api/getYearlyUsageBySID/', methods=['GET'])
    def getYearlyUsageBySID():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                sID = request.args.get('sID')
                query = """
                SELECT sID, YEAR(eventTime) AS Year, SUM(eventValue) AS totalUsage
                FROM ServiceLocation 
                NATURAL JOIN EnrolledDevice 
                NATURAL JOIN EnrolledDeviceEvent 
                NATURAL JOIN Event
                WHERE eventLabel = 'energy use' 
                AND sID = %s 
                GROUP BY sID, YEAR(eventTime)
                ORDER BY Year;
                """
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
    
    # get total number of service location by cID
    @app.route('/api/getTotalServiceLocationByCID/', methods=['GET'])
    def getTotalServiceLocation():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                cID = request.args.get('cID')
                query = """
                SELECT COUNT(*) AS totalServiceLocation
                FROM ServiceLocation
                WHERE cID = %s
                GROUP BY cID;
                """
                cursor.execute(query, (cID,))
                result = cursor.fetchone()
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
                query = """SELECT S.sID, S.serviceStatus, S.startDate, S.squareFt, S.bedroomNum, S.occupantNum, A.streetNum, A.street,A.unit, A.city, A.state, A.zipcode, A.country
                FROM ServiceLocation S JOIN Address A ON S.serviceAddressID = A.addressID
                WHERE S.cID = %s;"""
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
                query = """SELECT S.sID, S.serviceStatus, CONCAT(A.streetNum, ', ',A.street,', ',A.unit, ', ', A.city, ', ', A.state, ', ', A.zipcode,', ',A.country) AS serviceAddress
                FROM ServiceLocation S JOIN Address A ON S.serviceAddressID = A.addressID
                WHERE S.cID = %s and S.serviceStatus='active';"""
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
                
    # get supported device
    @app.route('/api/getSupportedDevice/', methods=['GET'])
    def getSupportedDevice():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                query = """SELECT DISTINCT type FROM Device;"""
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
    
    # get supported device by type
    @app.route('/api/getSupportedDeviceByType/', methods=['GET'])
    def getSupportedDeviceByType():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                type = request.args.get('type')
                query = """SELECT DISTINCT model FROM Device WHERE type = %s;"""
                cursor.execute(query, (type,))
                result = cursor.fetchall()
                if not result:
                    return jsonify([])
                return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)})
        finally:
            if conn:
                conn.close()
    
    # get devID by model and type
    @app.route('/api/getDevIDByModelAndType/', methods=['GET'])
    def getDevIDByModelAndType():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                model = request.args.get('model')
                type = request.args.get('type')
                query = """SELECT devID FROM Device WHERE model = %s AND type = %s;"""
                cursor.execute(query, (model,type,))
                result = cursor.fetchone()
                if not result:
                    return jsonify([])
                return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)})
        finally:
            if conn:
                conn.close()
    
    # get total number of enrolled device by cID
    @app.route('/api/getTotalEnrolledDeviceByCID/', methods=['GET'])
    def getTotalEnrolledDevice():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                cID = request.args.get('cID')
                query = """
                SELECT COUNT(*) AS totalEnrolledDevice
                FROM ServiceLocation NATURAL JOIN EnrolledDevice
                WHERE cID = %s;
                """
                cursor.execute(query, (cID,))
                result = cursor.fetchone()
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
                query = """SELECT enDevID,enDevName, model, type, enrolledStatus, 
                CONCAT(A.streetNum, ', ',A.street,', ',A.unit, ', ', A.city, ', ', A.state, ', ', A.zipcode,', ',A.country) AS serviceAddress 
                FROM EnrolledDevice 
                NATURAL JOIN Device 
                NATURAL JOIN ServiceLocation 
                SL JOIN Address A ON SL.serviceAddressID = A.addressID
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
    
    # get enrolled device by sID, enrolledStatus
    @app.route('/api/getEnrolledDevicesByStatus/', methods=['GET'])
    def getEnrolledDevicesByStatus():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                sID = request.args.get('sID')
                enrolledStatus = request.args.get('enrolledStatus')
                query = """
                SELECT enDevID, enDevName, model, type, enrolledStatus, 
                CONCAT(A.streetNum, ', ',A.street,', ',A.unit, ', ', A.city, ', ', A.state, ', ', A.zipcode,', ',A.country) AS serviceAddress 
                FROM EnrolledDevice 
                NATURAL JOIN Device 
                NATURAL JOIN ServiceLocation 
                SL JOIN Address A ON SL.serviceAddressID = A.addressID
                WHERE sID = %s AND enrolledStatus = %s;
                """
                cursor.execute(query, (sID,enrolledStatus,))
                result = cursor.fetchall()
                if not result:
                    return jsonify([])
                return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            if conn:
                conn.close()
                
    # get all enrolled device event by sID
    @app.route('/api/getEnrolledDeviceEvent/', methods=['GET'])
    def getEnrolledDeviceEvent():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                sID = request.args.get('sID')
                query = """SELECT sID, enDevID, enDevName, model, type, eID, eventLabel, eventValue, eventTime
                FROM ServiceLocation 
                NATURAL JOIN EnrolledDevice 
                NATURAL JOIN Device 
                NATURAL JOIN EnrolledDeviceEvent 
                NATURAL JOIN Event
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
                
    # get all enrolled device event by sID, enrolledStatus
    @app.route('/api/getEnrolledDeviceEventsByStatus/', methods=['GET'])
    def getEnrolledDeviceEventsByStatus():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                sID = request.args.get('sID')
                enrolledStatus= request.args.get('enrolledStatus')
                query = """SELECT sID, enDevID, enDevName, model, type, eID, eventLabel, eventValue, eventTime
                FROM ServiceLocation 
                NATURAL JOIN EnrolledDevice 
                NATURAL JOIN Device 
                NATURAL JOIN EnrolledDeviceEvent 
                NATURAL JOIN Event
                WHERE sID = %s AND enrolledStatus = %s;"""
                cursor.execute(query, (sID,enrolledStatus,))
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
                query = """SELECT sID, enDevID, enDevName, DATE(eventTime) AS Day, SUM(eventValue) AS totalUsage
                FROM ServiceLocation NATURAL JOIN EnrolledDevice NATURAL JOIN EnrolledDeviceEvent NATURAL JOIN Event
                WHERE eventLabel = 'energy use' AND cID = %s AND sID = %s AND MONTH(eventTime) = %s AND YEAR(eventTime) = %s
                GROUP BY sID, enDevID, enDevName, DATE(eventTime);"""
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
                query = """SELECT sID, enDevID, enDevName, MONTH(eventTime) AS Month, SUM(eventValue) AS totalUsage
                FROM ServiceLocation NATURAL JOIN EnrolledDevice NATURAL JOIN EnrolledDeviceEvent NATURAL JOIN Event
                WHERE eventLabel = 'energy use' AND cID = %s AND sID = %s AND YEAR(eventTime) = %s
                GROUP BY sID, enDevID, enDevName, MONTH(eventTime);"""
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
                query = """SELECT sID, enDevID, enDevName, YEAR(eventTime) AS Year, SUM(eventValue) AS totalUsage
                FROM ServiceLocation NATURAL JOIN EnrolledDevice NATURAL JOIN EnrolledDeviceEvent NATURAL JOIN Event
                WHERE eventLabel = 'energy use' AND cID = %s AND sID = %s 
                GROUP BY sID, enDevID, enDevName, YEAR(eventTime);"""
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