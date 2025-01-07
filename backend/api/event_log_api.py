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
    def exec(conn, query):
        try:
            with conn.cursor() as cursor:
                cursor.execute(query)
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        
    # Get enrolled device events by <service_location_id>, <enrolled_device_id>
    @app.route('/api/enrolled-device-events/<int:service_location_id>/<id:enrolled_device_id>', methods=['GET'])
    def get_enrolled_device_events_by_service_enrolled(service_location_id, enrolled_device_id):
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                # service_location_id = request.args.get('service_location_id')
                # enrolled_device_id = request.args.get('enrolled_device_id')
                query = """SELECT enrolled_device_event_id, service_location_id, enrolled_device_id, name, label, value, time
                FROM ServiceLocation 
                NATURAL JOIN EnrolledDevice 
                NATURAL JOIN EnrolledDeviceEvent 
                NATURAL JOIN Device 
                NATURAL JOIN Event
                WHERE service_location_id = %s
                AND enrolled_device_id = %s
                GROUP BY enrolled_device_event_id, service_location_id, enrolled_device_id
                ORDER BY time DESC;
                """
                cursor.execute(query, (service_location_id,enrolled_device_id))
                result = cursor.fetchall()
                if not result:
                    return jsonify([]), 204
                return jsonify(result), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally: 
            if conn:
                conn.close()

    # Add Enrolled Device Events
    @app.route('/api/enrolled-device-events/<int:service_location_id>', methods=['POST'])
    def post_enrolled_device_events(service_location_id):
        conn = None
        try:
            # service_location_id = request.args.get('service_location_id')
            conn = get_db_connection()

            enabled_enrolled_devices_query="""
            SELECT enrolled_device_id 
            FROM ServiceLocation SL 
            JOIN EnrolledDevice ED ON SL.service_location_id = ED.service_location_id
            WHERE SL.service_location_id = %s 
            AND ED.enrolled_status = 'enabled';
            """
            with conn.cursor() as cursor:
                cursor.execute(enabled_enrolled_devices_query, (service_location_id,))
                enabled_enrolled_devices = cursor.fetchall()
                test_size = len(enabled_enrolled_devices)

                if test_size == 0:
                    return jsonify({'message': f'No enabled devices at service location with id: {service_location_id}', 'success': False}), 200
                
                enrolled_device_event_values = []
                for i in range(test_size):
                    for _ in range(5):
                        hour = random.randint(0,23)
                        hour = str(hour) if hour >= 10 else '0' + str(hour)
                        minute = random.randint(0,59)
                        minute = str(minute) if minute >= 10 else '0' + str(minute)
                        second = random.randint(0,59)
                        second = str(second) if second >= 10 else '0' + str(second)
                        eventTime_random = str(random.randint(2021,2022))+ '-' + str(random.randint(1,12)) + '-' + str(random.randint(1,28)) + ' ' + hour + ':' + minute + ':' + second
                        eventValue_random = round(random.uniform(3, 10), 2)
                        enrolled_device_event_values.append("({}, {}, '{}', {})".format(enabled_enrolled_devices[i]['enrolled_device_id'], 1, eventTime_random, eventValue_random))
                

                insert_enrolledDeviceEvent_data = ','.join(enrolled_device_event_values)
                query_loading_enrolledDeviceEvent = f"""
                INSERT INTO EnrolledDeviceEvent (enrolled_device_id, event_id, time, value) VALUES
                {insert_enrolledDeviceEvent_data};
                """
                exec(conn, query_loading_enrolledDeviceEvent)
                conn.commit()

                return jsonify({'message': f'New events added for enabled devices at service location with id: {service_location_id}'}), 201
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()


    # Delete a enrolled device event by <enrolled_device_event_id>
    @app.route('/api/enrolled-device-events/<int:enrolled_device_event_id>', methods=['DELETE'])
    def delete_enrolled_device_events(enrolled_device_event_id):
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                query = "DELETE FROM EnrolledDeviceEvent WHERE enrolled_device_event_id = %s;"
                cursor.execute(query, (enrolled_device_event_id,))
                result = cursor.fetchone()
                conn.commit()
                if not result:
                    return jsonify([]), 204
                return jsonify(result), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally: 
            if conn:
                conn.close()


    # Get all enrolled device events by <service_location_id>
    @app.route('/api/enrolled-device-events/<int:service_location_id>', methods=['GET'])
    def get_enrolled_device_events_by_service(service_location_id):
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                service_location_id = request.args.get('service_location_id')
                query = """SELECT enrolled_device_event_id, name, label, value, time
                FROM ServiceLocation 
                NATURAL JOIN EnrolledDevice 
                NATURAL JOIN Device 
                NATURAL JOIN EnrolledDeviceEvent 
                NATURAL JOIN Event
                WHERE service_location_id = %s
                GROUP BY enrolled_device_event_id,name
                ORDER BY time DESC;
                """
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
                
    # Get all enrolled device events by <service_location_id>, <enrolled_status>
    @app.route('/api/enrolled-device-events/<int:service_location_id>/<string:enrolled_status>', methods=['GET'])
    def get_enrolled_device_events_by_service_enrolled(service_location_id, enrolled_status):
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                # service_location_id = request.args.get('service_location_id')
                # enrolled_status= request.args.get('enrolled_status')
                query = """SELECT enrolled_device_event_id, name, label, value, time
                FROM ServiceLocation 
                NATURAL JOIN EnrolledDevice 
                NATURAL JOIN Device 
                NATURAL JOIN EnrolledDeviceEvent 
                NATURAL JOIN Event
                WHERE service_location_id = %s AND enrolled_status = %s
                GROUP BY enrolled_device_event_id,name
                ORDER BY time DESC;
                """
                cursor.execute(query, (service_location_id,enrolled_status))
                result = cursor.fetchall()
                if not result:
                    return jsonify([]), 204
                return jsonify(result), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500 
        finally:
            if conn:
                conn.close()
    
    # Get daily usage of enrolled devices by <service_location_id>, <customer_id>, <month>, and <year>
    @app.route('/api/enrolled-device-events/daily-usage-enrolled-devices/<int:service_location_id>', methods=['GET'])
    def get_daily_usage_enrolled_devices(service_location_id):
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                customer_id = request.args.get('customer_id')
                # service_location_id = request.args.get('service_location_id')
                Month = request.args.get('Month')
                Year = request.args.get('Year')
                query = """SELECT service_location_id, enrolled_device_id, name, DATE(time) AS Day, SUM(value) AS totalUsage
                FROM ServiceLocation NATURAL JOIN EnrolledDevice NATURAL JOIN EnrolledDeviceEvent NATURAL JOIN Event
                WHERE label = 'energy use' AND customer_id = %s AND service_location_id = %s AND MONTH(time) = %s AND YEAR(time) = %s
                GROUP BY service_location_id, enrolled_device_id, name, DATE(time);"""
                cursor.execute(query, (customer_id, service_location_id, Month, Year))
                result = cursor.fetchall()
                if not result:
                    return jsonify([]), 204
                return jsonify(result), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()
                
    # Get monthly usage of enrolled devices by <service_location_id>, <customer_id>, and <year>
    @app.route('/api/enrolled-device-events/monthly-usage-enrolled-devices/<int:service_location_id>', methods=['GET'])
    def get_monthly_usage_enrolled_devices(service_location_id):
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                customer_id = request.args.get('customer_id')
                # service_location_id = request.args.get('service_location_id')
                Year = request.args.get('Year')
                query = """SELECT service_location_id, enrolled_device_id, name, MONTH(time) AS Month, SUM(value) AS totalUsage
                FROM ServiceLocation NATURAL JOIN EnrolledDevice NATURAL JOIN EnrolledDeviceEvent NATURAL JOIN Event
                WHERE label = 'energy use' AND customer_id = %s AND service_location_id = %s AND YEAR(time) = %s
                GROUP BY service_location_id, enrolled_device_id, name, MONTH(time);"""
                cursor.execute(query, (customer_id, service_location_id, Year))
                result = cursor.fetchall()
                if not result:
                    return jsonify([]), 204
                return jsonify(result), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()
    
    # Get yearly usage of enrolled devices by <service_location_id>, <customer_id>
    @app.route('/api/enrolled-device-events/yearly-usage-enrolled-devices/<int:service_location_id>', methods=['GET'])
    def get_yearly_usage_enrolled_devices(service_location_id):
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                customer_id = request.args.get('customer_id')
                # service_location_id = request.args.get('service_location_id')
                query = """SELECT service_location_id, enrolled_device_id, name, YEAR(time) AS Year, SUM(value) AS totalUsage
                FROM ServiceLocation NATURAL JOIN EnrolledDevice NATURAL JOIN EnrolledDeviceEvent NATURAL JOIN Event
                WHERE label = 'energy use' AND customer_id = %s AND service_location_id = %s 
                GROUP BY service_location_id, enrolled_device_id, name, YEAR(time);"""
                cursor.execute(query, (customer_id, service_location_id,))
                result = cursor.fetchall()
                if not result:
                    return jsonify([]), 204
                return jsonify(result), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally: 
            if conn:
                conn.close()
    



    
    

    