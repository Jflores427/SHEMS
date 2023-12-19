from flask import jsonify, request
import pymysql
import random

def get_db_connection():
    config = {
        'host': 'localhost',
        'user': 'root',
        'database': 'shems_test1',
        'charset': 'utf8mb4',
        'cursorclass': pymysql.cursors.DictCursor
    }
    return pymysql.connect(**config)

def exec(conn, query):
    try:
        with conn.cursor() as cursor:
            cursor.execute(query)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def addEnrolledDeviceEvent_configure_routes(app):
    @app.route('/api/addEDE', methods=['POST'])
    def addEnrolledDeviceEvent():
        conn = None
        try:
            conn = get_db_connection()
            
            test_size = 100
            enrolled_device_event_values = []
            for i in range(15*test_size):
                for j in range(3):
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
            conn.rollback()
            return jsonify({'error': str(e)}), 500
        finally:
            if conn:
                conn.close()