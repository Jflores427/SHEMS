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
    # Enroll a new device on <sID>, <devID>, <enDevName>
    @app.route('/api/enrollDevice', methods=['POST'])
    def enrollDevice():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                data=request.get_json()
                sID = data['sID']
                devID = data['devID']
                enDevName=data['enDevName']
                query = """INSERT INTO enrolledDevice (enDevName, devID, sID, enrolledStatus) 
                VALUES (%s, %s, %s, 'enabled');"""
                cursor.execute(query, (enDevName,devID, sID, ))
                enDevID=cursor.lastrowid
                conn.commit()
                return jsonify({'message': 'new device enrolled',
                                'enDevID':enDevID,
                                'enDevName':enDevName,
                                'devID':devID,
                                'sID':sID
                                }), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()
                
    # Set enrolled device status from <enDevID> and <enrolledStatus>
    @app.route('/api/setEnrolledDeviceStatus', methods=['POST'])
    def setEnrolledDeviceStatus():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                data=request.get_json()
                enDevID = data['enDevID']
                newEnrolledStatus = data['enrolledStatus']
                query = """UPDATE enrolledDevice SET enrolledStatus = %s WHERE enDevID = %s;"""
                cursor.execute(query, (newEnrolledStatus, enDevID,))
                conn.commit()
                return jsonify({'message': 'enrolled device status set to '+newEnrolledStatus}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()
    
    # Delete enrolled device with id <enDevID>
    @app.route('/api/deleteEnrolledDevice', methods=['DELETE'])
    def deleteEnrolledDevice():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                data =request.get_json()
                enDevID = data['enDevID']
                query = """DELETE FROM EnrolledDevice WHERE enDevID = %s;"""
                cursor.execute(query, (enDevID,))
                conn.commit()
                return jsonify({'message': f'Enrolled Device {enDevID} deleted'}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()

    # Get supported devices
    @app.route('/api/getSupportedDevice', methods=['GET'])
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
            return jsonify({'message': str(e)}), 500 
        finally:
            if conn:
                conn.close()            
    
    # Get supported device by <type>
    @app.route('/api/getSupportedDeviceByType', methods=['GET'])
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
            return jsonify({'message': str(e)})
        finally:
            if conn:
                conn.close()
    
    # Get devID by <model> and <type>
    @app.route('/api/getDevIDByModelAndType', methods=['GET'])
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
            return jsonify({'message': str(e)})
        finally:
            if conn:
                conn.close()
        
    # Get enrolled device by <sID>
    @app.route('/api/getEnrolledDevice', methods=['GET'])
    def getEnrolledDevice():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                sID = request.args.get('sID')
                query = """SELECT enDevID,enDevName, model, type, enrolledStatus, 
                CONCAT(A.streetNum, ', ',A.street,', ',A.unit, ', ', A.city, ', ', A.state, '
                , ', A.zipcode,', ',A.country) AS serviceAddress 
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
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()
    
    # Get enrolled device by <sID>, <enrolledStatus>
    @app.route('/api/getEnrolledDevicesByStatus', methods=['GET'])
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
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()