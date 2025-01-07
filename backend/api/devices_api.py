import pymysql
from flask import jsonify, request

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


def devices_configure_routes(app):
    # Enroll a new device on <service_location_id>, <device_id>, <name>
    @app.route('/api/enrolled-devices', methods=['POST'])
    def post_enrolled_devices():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                data = request.get_json()
                name = data['name']
                device_id = data['device_id']
                service_location_id = data['service_location_id']
                query = """INSERT INTO enrolledDevice (name, device_id, service_location_id, enrolled_status) 
                VALUES (%s, %s, %s, 'enabled');"""
                cursor.execute(query, (name, device_id, service_location_id))
                enrolled_device_id=cursor.lastrowid
                conn.commit()
                return jsonify({'message': 'New device enrolled successfully',
                                'enrolled_device_id': enrolled_device_id,
                                'name': name,
                                'device_id': device_id,
                                'service_location_id': service_location_id,
                                }), 201
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()
                
    # Set enrolled device status from <enrolled_device_id> and <enrolled_status>
    @app.route('/api/enrolled-devices/<int:enrolled_device_id>/status', methods=['PUT'])
    def put_enrolled_devices_status(enrolled_device_id):
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                data=request.get_json()
                new_enrolled_status = data['enrolled_status']
                query = "UPDATE enrolledDevice SET enrolled_status = %s WHERE enrolled_device_id = %s;"
                cursor.execute(query, (new_enrolled_status, enrolled_device_id))
                conn.commit()
                return jsonify({'message': f'enrolled device {enrolled_device_id} status set to {new_enrolled_status}' , 'success': True}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()
    
    # Delete enrolled device with id <enrolled_device_id>
    @app.route('/api/enrolled-devices/<int:enrolled_device_id>', methods=['DELETE'])
    def delete_enrolled_devices(enrolled_device_id):
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                enrolled_device_name_query = "SELECT name FROM EnrolledDevice WHERE enrolled_device_id = %s;"
                cursor.execute(enrolled_device_name_query, (enrolled_device_id,))
                enrolled_device_name = cursor.fetchone()['name']

                if not enrolled_device_name:
                    return jsonify({'message': f'Enrolled Device {enrolled_device_name} deleted'}), 200
                
                delete_query = "DELETE FROM EnrolledDevice WHERE enrolled_device_id = %s;"
                cursor.execute(delete_query, (enrolled_device_id,))
                conn.commit()
                return jsonify({'message': f'Enrolled Device {enrolled_device_name} deleted'}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()

    # Get supported device types
    @app.route('/api/devices/types', methods=['GET'])
    def get_devices_types():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                query = "SELECT DISTINCT type FROM Device;"
                cursor.execute(query)
                result = cursor.fetchall()
                if not result:
                    return jsonify([]), 204
                return jsonify(result)
        except Exception as e:
            return jsonify({'message': str(e)}), 500 
        finally:
            if conn:
                conn.close()            
    
    # Get supported device models by <type>
    @app.route('/api/devices/<string:type>/models', methods=['GET'])
    def get_devices_models(type):
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                query = "SELECT DISTINCT model FROM Device WHERE type = %s;"
                cursor.execute(query, (type,))
                result = cursor.fetchall()
                if not result:
                    return jsonify([]), 204
                return jsonify(result), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()
    
    # Get device_id by <model> and <type>
    @app.route('/api/devices/type/<string:type>/model/<string:model>', methods=['GET'])
    def get_devices(type, model):
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                # model = request.args.get('model')
                # type = request.args.get('type')
                query = "SELECT device_id FROM Device WHERE model = %s AND type = %s;"
                cursor.execute(query, (model, type))
                result = cursor.fetchone()
                if not result:
                    return jsonify([]), 204
                return jsonify(result), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()
        
    # Get enrolled device by <service_location_id>
    @app.route('/api/enrolled-devices/<int:service_location_id>', methods=['GET'])
    def get_enrolled_devices_by_service(service_location_id):
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                # service_location_id = request.args.get('service_location_id')
                query = """SELECT enrolled_device_id, name, model, type, enrolled_status, 
                CONCAT(A.streetNum, ', ',A.street,', ',A.unit, ', ', A.city, ', ', A.state, '
                , ', A.zipcode,', ',A.country) AS serviceAddress 
                FROM EnrolledDevice 
                NATURAL JOIN Device 
                NATURAL JOIN ServiceLocation SL 
                JOIN Address A ON SL.serviceAddressID = A.addressID
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
    
    # Get enrolled device by <service_location_id>, <enrolled_status>
    @app.route('/api/enrolled-devices/<int:service_location_id>/status/<string:enrolled_status>', methods=['GET'])
    def get_enrolled_devices_by_service_status(service_location_id, enrolled_status):
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                # service_location_id = request.args.get('service_location_id')
                # enrolled_status = request.args.get('enrolled_status')
                query = """
                SELECT enrolled_device_id, name, model, type, enrolled_status, 
                CONCAT(A.streetNum, ', ',A.street,', ',A.unit, ', ', A.city, ', ', A.state, ', ', A.zipcode,', ',A.country) AS serviceAddress 
                FROM EnrolledDevice 
                NATURAL JOIN Device 
                NATURAL JOIN ServiceLocation 
                SL JOIN Address A ON SL.serviceAddressID = A.addressID
                WHERE service_location_id = %s AND enrolled_status = %s;
                """
                cursor.execute(query, (service_location_id, enrolled_status))
                result = cursor.fetchall()
                if not result:
                    return jsonify([])
                return jsonify(result)
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()