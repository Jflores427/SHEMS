import pymysql
from flask import jsonify, request
from threading import Lock
from api.address_api import handleAddress

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

def service_locations_configure_routes(app):
    addServiceLocation_lock = Lock()
    # Adds a new service location with <cID>, <startDate>, <squareFt>, <bedroomNum>, <occupantNum>, and <serviceStatus>
    @app.route('/api/addServiceLocation', methods=['POST'])
    def addServiceLocation():
        with addServiceLocation_lock:
            conn = None
            try:
                conn = get_db_connection()
                with conn.cursor() as cursor:
                    data=request.get_json()
                    cID = data['cID']
                    startDate = data['startDate']
                    squareFt = data['squareFt']
                    bedroomNum = data['bedroomNum']
                    occupantNum = data['occupantNum']
                    serviceStatus = data['serviceStatus']
                    response, status_code = handleAddress()
                    if status_code != 200:
                        return response, status_code
                    else:
                        addressID = response.get_json()['addressID']

                    query = """INSERT INTO ServiceLocation (cID, serviceAddressID, startDate, squareFt, 
                    bedroomNum, occupantNum, serviceStatus)
                    VALUES (%s, %s, %s, %s, %s, %s, %s);"""
                    cursor.execute(query, (cID, addressID, startDate, squareFt, 
                                           bedroomNum, occupantNum, serviceStatus))
                    conn.commit()
                    return jsonify({'message': 'service location added'}), 200
            except Exception as e:
                return jsonify({'message': str(e)}), 500
            finally:
                if conn:
                    conn.close()

    # Set service location status by <sID> and <serviceStatus>
    @app.route('/api/setServiceLocationStatus', methods=['POST'])
    def setServiceLocationStatus():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                data=request.get_json()
                serviceLocationID = data['sID']
                newServiceStatus = data['serviceStatus']
                query = """UPDATE ServiceLocation SET serviceStatus = %s WHERE sID = %s;"""
                cursor.execute(query, (newServiceStatus, serviceLocationID,))
                conn.commit()
                return jsonify({'message': 'service location status set to '+newServiceStatus}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()

    # Delete service location with <sID>
    @app.route('/api/deleteServiceLocation', methods=['DELETE'])
    def deleteServiceLocation():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                data=request.get_json()
                serviceLocationID = data['sID']
                query = """DELETE FROM ServiceLocation WHERE sID = %s;"""
                cursor.execute(query, (serviceLocationID,))
                conn.commit()
                return jsonify({'message': f'service location {serviceLocationID} deleted'}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()
     
    # Get service location by <cID> (inactive and active)
    @app.route('/api/getServiceLocation', methods=['GET'])
    def getServiceLocation():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                cID = request.args.get('cID')
                print(cID)
                query = """SELECT S.sID, S.serviceStatus, DATE_FORMAT(S.startDate, '%%M %%D, %%Y') AS startDate, S.squareFt, S.bedroomNum, 
                S.occupantNum, A.streetNum, A.street,A.unit, A.city, A.state, A.zipcode, A.country
                FROM ServiceLocation S JOIN Address A ON S.serviceAddressID = A.addressID
                WHERE S.cID = %s;"""
                cursor.execute(query, (cID,))
                result = cursor.fetchall()
                if not result:
                    return jsonify([])
                return jsonify(result)
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()
    
    # get service location by <cID> (active)
    @app.route('/api/getActiveServiceLocation', methods=['GET'])
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
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()

