from flask import jsonify, request
import pymysql
from threading import Lock
import random

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

def exec(conn, query):
    try:
        with conn.cursor() as cursor:
            cursor.execute(query)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
            
def create_table_configure_routes(app):

    @app.route('/api/create_table/initial', methods=['POST'])
    def initial_tables():
        conn = None
        try:
            conn = get_db_connection()
            
            query_user = """CREATE TABLE User (
                uID INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                cID INT NOT NULL,
                FOREIGN KEY (cID) references Customer(cID)
                );"""
            
            query_customer = """CREATE TABLE Customer(
                cID INT PRIMARY KEY AUTO_INCREMENT,
                cFirstName VARCHAR(32) NOT NULL,
                cLastName VARCHAR(32) NOT NULL,
                billingAddressID INT NOT NULL,
                FOREIGN KEY (billingAddressID) references Address(addressID)
                );"""
            
            query_address = """CREATE TABLE Address(
                addressID INT PRIMARY KEY AUTO_INCREMENT,
                streetNum VARCHAR(32) NOT NULL,
                street VARCHAR(64) NOT NULL,
                unit VARCHAR(32),
                city VARCHAR(64) NOT NULL,
                state VARCHAR(64) NOT NULL,
                zipcode VARCHAR(32) NOT NULL,
                country VARCHAR(64) NOT NULL
                );"""
            
            query_servicelocation = """CREATE TABLE ServiceLocation(
                sID INT PRIMARY KEY AUTO_INCREMENT,
                cID INT NOT NULL,
                serviceAddressID INT NOT NULL,
                startDate DATE NOT NULL,
                squareFt NUMERIC(8,2) NOT NULL CHECK(squareFT>0), bedroomNum INT NOT NULL CHECK(bedroomNum>=0), 
                occupantNum INT NOT NULL CHECK(occupantNum>=0), 
                serviceStatus VARCHAR(32) NOT NULL CHECK(serviceStatus IN ('active', 'inactive')),
                FOREIGN KEY (cID) references Customer(cID),
                FOREIGN KEY (serviceAddressID) references Address(addressID)
                );"""
            
            query_device = """CREATE TABLE Device(
                devID INT PRIMARY KEY AUTO_INCREMENT, 
                model VARCHAR(64) NOT NULL,
                type VARCHAR(64) NOT NULL
                );"""
            
            query_event = """CREATE TABLE Event(
                eID INT PRIMARY KEY AUTO_INCREMENT, 
                eventLabel VARCHAR(128) NOT NULL
                );"""
            
            query_device_event = """CREATE TABLE DeviceEvent(
                devID INT NOT NULL,
                eID INT NOT NULL,
                PRIMARY KEY (devID, eID),
                FOREIGN KEY (devID) references Device(devID), 
                FOREIGN KEY (eID) references Event(eID)
                );"""
                
            query_enrolled_device = """CREATE TABLE EnrolledDevice(
                enDevID INT PRIMARY KEY AUTO_INCREMENT, devID INT,
                sID INT,
                enrolledStatus VARCHAR(32) NOT NULL CHECK(enrolledStatus IN ('enrolled', 'not enrolled')),
                FOREIGN KEY (devID) references Device(devID), 
                FOREIGN KEY (sID) references ServiceLocation(sID)
                );"""
            
            query_enrolled_device_event = """CREATE TABLE EnrolledDeviceEvent(
                edEventID INT PRIMARY KEY AUTO_INCREMENT,
                enDevID INT,
                eID INT,
                eventTime TIMESTAMP NOT NULL,
                eventValue NUMERIC(8,2) NOT NULL,
                FOREIGN KEY (enDevID) references EnrolledDevice(enDevID), 
                FOREIGN KEY (eID) references Event(eID)
                );"""
            query_energy_price = """CREATE TABLE EnergyPrice(
                epID INT PRIMARY KEY AUTO_INCREMENT,
                zipcode VARCHAR(10) NOT NULL,
                startHourTime INT(2) NOT NULL CHECK(startHourTime >= 0 AND startHourTime < 24), 
                priceKWH Numeric(8,2) NOT NULL CHECK(priceKWH>=0)
                );"""
            
            exec(conn, query_address)
            exec(conn, query_customer)
            exec(conn, query_user)
            exec(conn, query_servicelocation)
            exec(conn, query_device)
            exec(conn, query_event)
            exec(conn, query_device_event)
            exec(conn, query_enrolled_device)
            exec(conn, query_enrolled_device_event)
            exec(conn, query_energy_price)
            
            query_loading_devices = """
                INSERT INTO Device (model, type) VALUES 
                ('A330', 'refrigerator'),
                ('A350', 'refrigerator'),
                ('A370', 'refrigerator'), 
                ('Q30', 'television'), 
                ('Q40U', 'television'), 
                ('Q50X', 'television'), 
                ('Q60UX', 'television'), 
                ('M190', 'microwave'), 
                ('M290', 'microwave'), 
                ('M390', 'microwave'), 
                ('M490', 'microwave'), 
                ('A100', 'oven'),
                ('A200', 'oven'),
                ('A800', 'oven'),
                ('S35', 'speaker'),
                ('S45', 'speaker'),
                ('S55', 'speaker'), 
                ('H100', 'electric heater'), 
                ('H200', 'electric heater'), 
                ('H800', 'electric heater');
            """
            
            query_loading_events = """
                INSERT INTO Event ( eventLabel) VALUES 
                ('energy use'),
                ('door open'),
                ('door close'),
                ('switch on'),
                ('switch off'), 
                ('temperature lower'), 
                ('temperature higher'), 
                ('volume lower'), 
                ('volume higher');
            """
            
            query_loading_deviceevent="""
                INSERT INTO DeviceEvent(devID, eID) VALUES 
                (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),
                (2,1),(2,2),(2,3),(2,4),(2,5),(2,6),(2,7),
                (3,1),(3,2),(3,3),(3,4),(3,5),(3,6),(3,7),
                (4,1),(4,4),(4,5),(4,8),(4,9),
                (5,1),(5,4),(5,5),(5,8),(5,9),
                (6,1),(6,4),(6,5),(6,8),(6,9),
                (7,1),(7,4),(7,5),(7,8),(7,9),
                (8,1),(8,2),(8,3),(8,4),(8,5),(8,6),(8,7),
                (9,1),(9,2),(9,3),(9,4),(9,5),(9,6),(9,7),
                (10,1),(10,2),(10,3),(10,4),(10,5),(10,6),(10,7),
                (11,1),(11,2),(11,3),(11,4),(11,5),(11,6),(11,7),
                (12,1),(12,2),(12,3),(12,4),(12,5),(12,6),(12,7),
                (13,1),(13,2),(13,3),(13,4),(13,5),(13,6),(13,7),
                (14,1),(14,2),(14,3),(14,4),(14,5),(14,6),(14,7),
                (15,1),(15,4),(15,5),(15,8),(15,9), (16,1),(16,4),
                (16,5),(16,8),(16,9),
                (17,1),(17,4),(17,5),(17,8),(17,9),
                (18,1),(18,4),(18,5),(18,6),(18,7),
                (19,1),(19,4),(19,5),(19,6),(19,7),
                (20,1),(20,4),(20,5),(20,6),(20,7);
                """

            zipcode = ['77030','33132','11001','33139','02130', '02445','02116','11220','94112','94107']
            values = []
            for zc in zipcode:
                for hour in range(24):
                    rate = round(random.uniform(0.15, 0.45), 2)
                    values.append("('{}', {}, {})".format(zc, hour, rate))
            insert_price_data = ','.join(values)
            query_loading_fixed_rate = f"""
            INSERT INTO EnergyPrice (zipcode, startHourTime, priceKWH) VALUES 
            {insert_price_data};
            """
                
                
            exec(conn, query_loading_devices)
            exec(conn, query_loading_events)
            exec(conn, query_loading_deviceevent)
            exec(conn, query_loading_fixed_rate)
            
            conn.commit()
            return jsonify({'success': True})
        except Exception as e:
            conn.rollback()
            return jsonify({'error': str(e)}), 500
        finally:
            if conn:
                conn.close()