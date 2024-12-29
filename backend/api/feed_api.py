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
                SELECT cID, sID, YEAR(eventTime) AS Year, MONTH(eventTime) AS Month, 
                SUM(eventValue) AS totalUsage
                FROM ServiceLocation 
                NATURAL JOIN EnrolledDevice 
                NATURAL JOIN EnrolledDeviceEvent 
                NATURAL JOIN Event
                WHERE eventLabel = 'energy use' 
                AND cID = %s 
                GROUP BY cID, sID, Year, Month
                ORDER BY sID, Year, Month;
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
                SELECT cID, sID, YEAR(eventTime) AS Year, MONTH(eventTime) AS Month, 
                SUM(eventValue*priceKWH) AS totalCost
                FROM ServiceLocation SL
                JOIN Address A ON SL.serviceAddressID = A.addressID
                JOIN EnergyPrice EP ON A.zipcode = EP.zipcode
                NATURAL JOIN EnrolledDevice 
                NATURAL JOIN EnrolledDeviceEvent
                NATURAL JOIN Event
                WHERE eventLabel = 'energy use' 
                AND cID = %s 
                AND HOUR(eventTime) = EP.startHourTime
                GROUP BY cID, sID, Year, Month
                ORDER BY sID, Year, Month;
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
    
    # Get daily usage by <sID>, <Month>, and <Year>
    @app.route('/api/getDailyUsageBySID', methods=['GET'])
    def getDailyUsageBySID():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                sID = request.args.get('sID')
                Month = request.args.get('Month')
                Year = request.args.get('Year')
                query = """
                SELECT sID, DATE_FORMAT(eventTime, '%%b %%D %%Y') AS Day, SUM(eventValue) AS totalUsage
                FROM ServiceLocation 
                NATURAL JOIN EnrolledDevice 
                NATURAL JOIN EnrolledDeviceEvent 
                NATURAL JOIN Event
                WHERE eventLabel = 'energy use' 
                AND sID = %s 
                AND MONTH(eventTime) = %s 
                AND YEAR(eventTime) = %s
                GROUP BY sID, Day
                ORDER BY Day;
                """
                cursor.execute(query, ( sID, Month,Year))
                result = cursor.fetchall()
                if not result:
                    return jsonify([])
                return jsonify(result)
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()
    
    # Get daily Metrics (Usage, Cost) by <sID>, <Month>, and <Year>
    @app.route('/api/getDailyMetricsBySID', methods=['GET'])
    def getDailyMetricsBySID():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                sID = request.args.get('sID')
                Month = request.args.get('Month')
                Year = request.args.get('Year')
                query = """
                SELECT sID, DATE_FORMAT(eventTime, '%%W,\n %%d %%b %%Y') AS Day, SUM(eventValue) AS totalUsage, 
                SUM(eventValue*priceKWH) AS totalCost
                FROM ServiceLocation SL
                JOIN Address A ON SL.serviceAddressID = A.addressID
                JOIN EnergyPrice EP ON A.zipcode = EP.zipcode 
                NATURAL JOIN EnrolledDevice 
                NATURAL JOIN EnrolledDeviceEvent 
                NATURAL JOIN Event
                WHERE eventLabel = 'energy use' 
                AND HOUR(eventTime) = EP.startHourTime
                AND sID = %s 
                AND MONTH(eventTime) = %s 
                AND YEAR(eventTime) = %s
                GROUP BY sID, Day
                ORDER BY Day;
                """
                cursor.execute(query, ( sID, Month,Year))
                result = cursor.fetchall()
                if not result:
                    return jsonify([])
                return jsonify(result)
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()


    # Get monthly usage by <sID> and <Year>
    @app.route('/api/getMonthlyUsageBySID', methods=['GET'])
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
                GROUP BY sID, Month
                ORDER BY Month;
                """
                cursor.execute(query, ( sID, Year,))
                result = cursor.fetchall()
                if not result:
                    return jsonify([])
                return jsonify(result)
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()

    # Get monthly metrics (Usage, Cost) by <sID> and <Year>
    @app.route('/api/getMonthlyMetricsBySID', methods=['GET'])
    def getMonthlyMetricsBySID():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                sID = request.args.get('sID')
                Year = request.args.get('Year')
                query = """
                SELECT sID, MONTH(eventTime) AS Month, SUM(eventValue) AS totalUsage,
                SUM(eventValue*priceKWH) AS totalCost
                FROM ServiceLocation SL
                JOIN Address A ON SL.serviceAddressID = A.addressID
                JOIN EnergyPrice EP ON A.zipcode = EP.zipcode 
                NATURAL JOIN EnrolledDevice 
                NATURAL JOIN EnrolledDeviceEvent 
                NATURAL JOIN Event
                WHERE eventLabel = 'energy use' 
                AND HOUR(eventTime) = EP.startHourTime
                AND sID = %s 
                AND YEAR(eventTime) = %s
                GROUP BY sID, Month
                ORDER BY Month;
                """
                cursor.execute(query, ( sID, Year,))
                result = cursor.fetchall()
                if not result:
                    return jsonify([])
                return jsonify(result)
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()
                
    # Get yearly usage by <sID>
    @app.route('/api/getYearlyUsageBySID', methods=['GET'])
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
                GROUP BY sID, Year
                ORDER BY Year;
                """
                cursor.execute(query, ( sID,))
                result = cursor.fetchall()
                if not result:
                    return jsonify([])
                return jsonify(result)
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()

    # Get yearly metrics (Usage, Cost) by <sID>
    @app.route('/api/getYearlyMetricsBySID', methods=['GET'])
    def getYearlyMetricsBySID():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                sID = request.args.get('sID')
                query = """
                SELECT sID, YEAR(eventTime) AS Year, SUM(eventValue) AS totalUsage,
                SUM(eventValue*priceKWH) AS totalCost
                FROM ServiceLocation SL
                JOIN Address A ON SL.serviceAddressID = A.addressID 
                JOIN EnergyPrice EP ON A.zipcode = EP.zipcode
                NATURAL JOIN EnrolledDevice 
                NATURAL JOIN EnrolledDeviceEvent 
                NATURAL JOIN Event
                WHERE eventLabel = 'energy use' 
                AND HOUR(eventTime) = EP.startHourTime
                AND sID = %s 
                GROUP BY sID, Year
                ORDER BY Year;
                """
                cursor.execute(query, ( sID,))
                result = cursor.fetchall()
                if not result:
                    return jsonify([])
                return jsonify(result)
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()
    
    # Gets the distinct months for Energy Use by <sID> and <Year>
    @app.route('/api/getEnergyUseMonthsByYearAndSID', methods=['GET'])
    def getEnergyUseMonthsByYearAndSID():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                sID = request.args.get('sID')
                year = request.args.get('Year')
                query = """
                SELECT sID, MONTH(eventTime) AS Month
                FROM ServiceLocation 
                NATURAL JOIN EnrolledDevice 
                NATURAL JOIN EnrolledDeviceEvent 
                NATURAL JOIN Event
                WHERE eventLabel = 'energy use' 
                AND sID = %s 
                AND YEAR(eventTime) = %s
                GROUP BY sID, Month
                ORDER BY Month;
                """
                cursor.execute(query, ( sID, year,))
                result = cursor.fetchall()
                if not result:
                    return jsonify([])
                return jsonify(result)
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()
    
    # Gets the distinct months for Energy Use by <sID>
    @app.route('/api/getEnergyUseYearsBySID', methods=['GET'])
    def getEnergyUseYearsBySID():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                sID = request.args.get('sID')
                query = """
                SELECT DISTINCT Year(eventTime) AS Year
                FROM ServiceLocation 
                NATURAL JOIN EnrolledDevice 
                NATURAL JOIN EnrolledDeviceEvent 
                NATURAL JOIN Event
                WHERE eventLabel = 'energy use' 
                AND sID = %s 
                ORDER BY Year;
                """
                cursor.execute(query, ( sID,))
                result = cursor.fetchall()
                if not result:
                    return jsonify([])
                return jsonify(result)
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()