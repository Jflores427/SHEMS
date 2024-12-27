import pymysql
from flask import jsonify, request
import random

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

def event_log_configure_routes(app):
    # Get all enrolled device events by <sID>
    @app.route('/api/getEnrolledDeviceEvent', methods=['GET'])
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
            return jsonify({'message': str(e)}), 500
        finally: 
            if conn:
                conn.close()
                
    # Get all enrolled device events by <sID>, <enrolledStatus>
    @app.route('/api/getEnrolledDeviceEventsByStatus', methods=['GET'])
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
            return jsonify({'message': str(e)}), 500 
        finally:
            if conn:
                conn.close()
    
    # Get daily usage of enrolled device by <sID>, <cID>, <month>, and <year>
    @app.route('/api/getDailyUsageOfEnrolledDevice', methods=['GET'])
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
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()
                
    # Get monthly usage of enrolled devices by <sID>, <cID>, and <year>
    @app.route('/api/getMonthlyUsageOfEnrolledDevice', methods=['GET'])
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
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()
    
    # Get yearly usage of enrolled devices by <sID>, <cID>
    @app.route('/api/getYearlyUsageOfEnrolledDevice', methods=['GET'])
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
            return jsonify({'message': str(e)}), 500
        finally: 
            if conn:
                conn.close()
    

    def exec(conn, query):
        try:
            with conn.cursor() as cursor:
                cursor.execute(query)
        except Exception as e:
            return jsonify({'message': str(e)}), 500


    # Add Enrolled Device Events
    @app.route('/api/addEDE', methods=['POST'])
    def addEDE():
        conn = None
        try:
            conn = get_db_connection()
            
            test_size = 100
            enrolled_device_event_values = []
            for i in range(15*test_size):
                for j in range(2):
                    hour = random.randint(0,23)
                    hour = str(hour) if hour >= 10 else '0'+str(hour)
                    minute = random.randint(0,59)
                    minute = str(minute) if minute >= 10 else '0'+str(minute)
                    second = random.randint(0,59)
                    second = str(second) if second >= 10 else '0'+str(second)
                    eventTime_random = str(random.randint(2021,2022))+'-'+str(random.randint(1,12))+'-'+str(random.randint(1,28))+' '+hour+':'+minute+':'+second
                    eventValue_random = round(random.uniform(3, 10), 2)
                    enrolled_device_event_values.append("({}, {}, '{}', {})".format(i+1, 1, eventTime_random, eventValue_random))
            
            insert_enrolledDeviceEvent_data = ','.join(enrolled_device_event_values)
            query_loading_enrolledDeviceEvent = f"""
            INSERT INTO EnrolledDeviceEvent (enDevID, eID, eventTime, eventValue) VALUES
            {insert_enrolledDeviceEvent_data};
            """

            exec(conn, query_loading_enrolledDeviceEvent)
            conn.commit()
            return jsonify({'success': True})
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()
    