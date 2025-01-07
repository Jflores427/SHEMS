from flask import jsonify
import pymysql
import random
from werkzeug.security import generate_password_hash

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
        print(str(e))
        return jsonify({'message': str(e)}), 500
            
def create_table_configure_routes(app):
    # Create Tables Route
    @app.route('/api/create-table/initial', methods=['POST'])
    def initial_tables():
        conn = None
        try:
            conn = get_db_connection()
            # Drops tables if they already exist
            disable_foreign_key_checks = """
            SET FOREIGN_KEY_CHECKS = 0;
            """
            query_drop_address = """
            DROP TABLE IF EXISTS `address`;
            """
            query_drop_customer = """
            DROP TABLE IF EXISTS `customer`;
            """
            query_drop_device = """
            DROP TABLE IF EXISTS `device`;
            """
            query_drop_device_event = """
            DROP TABLE IF EXISTS `deviceevent`;
            """
            query_drop_energy_price = """
            DROP TABLE IF EXISTS `energyprice`;
            """
            query_drop_enrolled_device = """
            DROP TABLE IF EXISTS `enrolleddevice`;
            """
            query_drop_enrolled_device_event = """
            DROP TABLE IF EXISTS `enrolleddeviceevent`;
            """
            query_drop_event = """
            DROP TABLE IF EXISTS `event`;
            """
            query_drop_service_location = """
            DROP TABLE IF EXISTS `servicelocation`;
            """
            query_drop_user = """
            DROP TABLE IF EXISTS `user`;
            """
            query_drop_token = """
            DROP TABLE IF EXISTS `token`;
            """

            enable_foreign_key_checks = """
            SET FOREIGN_KEY_CHECKS = 1;
            """

            exec(conn, disable_foreign_key_checks)
            exec(conn, query_drop_address)
            exec(conn, query_drop_customer)
            exec(conn, query_drop_device)
            exec(conn, query_drop_device_event)
            exec(conn, query_drop_energy_price)
            exec(conn, query_drop_enrolled_device)
            exec(conn, query_drop_enrolled_device_event)
            exec(conn, query_drop_device_event)
            exec(conn, query_drop_event)
            exec(conn, query_drop_service_location)
            exec(conn, query_drop_user)
            exec(conn, query_drop_token)
            exec(conn, enable_foreign_key_checks)
            
            # Creates data model tables
            query_user = """CREATE TABLE User (
                user_id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                customer_id INT UNIQUE NOT NULL,
                FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE
                );"""
            
            query_token= """ CREATE TABLE Token (
                token_id INT AUTO_INCREMENT PRIMARY KEY,
                token_string VARCHAR(2000) NOT NULL,
                expires_at DATETIME NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_invalid BOOLEAN DEFAULT FALSE,
                user_id INT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
                );"""
            
            # Limit of the length of URLs by HTTPs standards
            query_customer = """CREATE TABLE Customer(
                customer_id INT PRIMARY KEY AUTO_INCREMENT,
                first_name VARCHAR(32) NOT NULL,
                last_name VARCHAR(32) NOT NULL,
                profile_url VARCHAR(2000) DEFAULT NULL,
                address_id INT NOT NULL UNIQUE,
                FOREIGN KEY (address_id) REFERENCES Address(address_id) ON DELETE CASCADE
                );"""
            
            query_address = """CREATE TABLE Address(
                address_id INT PRIMARY KEY AUTO_INCREMENT,
                address_type ENUM('billing', 'service'),
                street_num VARCHAR(32) NOT NULL,
                street VARCHAR(64) NOT NULL,
                unit VARCHAR(32),
                city VARCHAR(64) NOT NULL,
                state VARCHAR(64) NOT NULL,
                zip_code VARCHAR(5) NOT NULL CHECK(CAST(zip_code AS UNSIGNED) >= 0 AND CAST(zip_code AS UNSIGNED) <= 99999),
                country VARCHAR(64) NOT NULL,
                UNIQUE (address_type, street_num, street, unit, city, state, zip_code, country)
                );"""
            
            query_servicelocation = """CREATE TABLE ServiceLocation(
                service_location_id INT PRIMARY KEY AUTO_INCREMENT,
                start_date DATE NOT NULL,
                square_ft NUMERIC(8,2) NOT NULL CHECK(square_ft > 0), 
                bedroom_num INT NOT NULL CHECK(bedroom_Num >= 0), 
                occupant_num INT NOT NULL CHECK(occupant_num >=0), 
                service_status ENUM('active', 'inactive'),
                customer_id INT NOT NULL,
                address_id INT NOT NULL,
                FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE, 
                FOREIGN KEY (address_id) REFERENCES Address(address_id) ON DELETE CASCADE,
                UNIQUE(start_date, square_ft, bedroom_num, occupant_num, service_status, address_id)
                );"""
            
            query_device = """CREATE TABLE Device(
                device_id INT PRIMARY KEY AUTO_INCREMENT, 
                model VARCHAR(64) NOT NULL,
                type VARCHAR(64) NOT NULL,
                UNIQUE(model, type)
                );"""
            
            query_event = """CREATE TABLE Event(
                event_id INT PRIMARY KEY AUTO_INCREMENT, 
                label VARCHAR(128) UNIQUE NOT NULL
                );"""
            
            query_device_event = """CREATE TABLE DeviceEvent(
                device_id INT NOT NULL,
                event_id INT NOT NULL,
                PRIMARY KEY (device_id, event_id),
                FOREIGN KEY (device_id) REFERENCES Device(device_id) ON DELETE CASCADE, 
                FOREIGN KEY (event_id) REFERENCES Event(event_id) ON DELETE CASCADE
                );"""
                
            query_enrolled_device = """CREATE TABLE EnrolledDevice(
                enrolled_device_id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(64) UNIQUE,
                enrolled_status ENUM('enabled', 'disabled'),
                device_id INT,
                service_location_id INT,
                FOREIGN KEY (device_id) REFERENCES Device(device_id) ON DELETE CASCADE, 
                FOREIGN KEY (service_location_id) REFERENCES ServiceLocation(service_location_id) ON DELETE CASCADE
                );"""
            
            query_enrolled_device_event = """CREATE TABLE EnrolledDeviceEvent(
                enrolled_device_event_id INT PRIMARY KEY AUTO_INCREMENT,
                time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                value NUMERIC(8,2) NOT NULL,
                enrolled_device_id INT,
                event_id INT,
                FOREIGN KEY (enrolled_device_id) REFERENCES EnrolledDevice(enrolled_device_id) ON DELETE CASCADE, 
                FOREIGN KEY (event_id) REFERENCES Event(event_id) ON DELETE CASCADE
                );"""
            
            query_energy_price = """CREATE TABLE EnergyPrice(
                energy_price_id INT PRIMARY KEY AUTO_INCREMENT,
                zip_code VARCHAR(10) NOT NULL,
                start_hour_time INT(2) NOT NULL CHECK(start_hour_time >= 0 AND start_hour_time < 24), 
                price_kwh Numeric(8,2) NOT NULL CHECK(price_kwh >= 0)
                );"""

            exec(conn, query_address)
            exec(conn, query_customer)
            exec(conn, query_user)
            exec(conn, query_token)
            exec(conn, query_servicelocation)
            exec(conn, query_device)
            exec(conn, query_event)
            exec(conn, query_device_event)
            exec(conn, query_enrolled_device)
            exec(conn, query_enrolled_device_event)
            exec(conn, query_energy_price)
            
            # Populating data into the data model tables
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
                INSERT INTO Event (label) VALUES 
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
                INSERT INTO DeviceEvent(device_id, event_id) VALUES 
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
            exec(conn, query_loading_devices)
            exec(conn, query_loading_events)
            exec(conn, query_loading_deviceevent)

            for i in range(5):
                rate_values = []
                for initial_zc in range(i * 20000, 20000*(i + 1), 1):
                    zc = initial_zc
                    if i == 0:
                        zc = str(initial_zc).zfill(5)
                    for hour in range(24):
                        rate = round(random.uniform(0.15, 0.45), 2)
                        rate_values.append("('{}', {}, {})".format(zc, hour, rate))
                insert_price_data = ','.join(rate_values)
                query_loading_fixed_rate = f"""
                INSERT INTO EnergyPrice (zip_code, start_hour_time, price_kwh) VALUES 
                {insert_price_data};
                """
                exec(conn, query_loading_fixed_rate)

            # Create an index on EnergyPrice zip_code (Frequent Access)
            query_index_energy_price_on_zipcode = """
            CREATE INDEX idx_energyprice_zipcode ON EnergyPrice(zip_code);
            """
            exec(conn, query_index_energy_price_on_zipcode)
            
            
            # -------Sample data----------------
            test_size = 100

            first_name = ['John','Mary','David','James','Robert','Jennifer','Linda','Barbara','Susan','Margaret']
            last_name = ['Smith','Johnson','Williams','Jones','Brown','Davis','Miller','Wilson','Moore','Taylor']
            street_num = ['1','2','3','4','5','6','7','8','9','10']
            street = ['Main','High','Park','Oak','Cedar','Elm','Pine','Maple','Washington','Lake']
            unit = ['A','B','C','D','E','F','G','H','I','J']
            city = ['Houston','Miami','New York','San Francisco','Boston']
            state = ['TX','FL','NY','CA','MA']
            zip_code = ['77030','33132','11001','33139','02130', '02445','02116','11220','94112','94107']
            country = ['USA','Taiwan','Japan','Korea','Canada','Mexico','China','UK','France','Germany']
            customer_values = []
            address_values = []
            for i in range(test_size):
                first_name_random = random.choice(first_name)
                last_name_random = random.choice(last_name)
                street_num_random = random.choice(street_num)
                street_random = random.choice(street)
                unit_random = random.choice(unit)
                city_random = random.choice(city)
                state_random = random.choice(state)
                zip_code_random = random.choice(zip_code)
                country_random = random.choice(country)
                address_values.append("('{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}')".format('billing', street_num_random, street_random, unit_random, city_random, state_random, zip_code_random, country_random))
                address_values.append("('{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}')".format('service', street_num_random, street_random, unit_random, city_random, state_random, zip_code_random, country_random))
                customer_values.append("('{}', '{}', '{}', {})".format(first_name_random, last_name_random, '', (2 * i) + 1))
            insert_address_data = ','.join(address_values)
            insert_customer_data = ','.join(customer_values)
            query_loading_address = f"""
            INSERT INTO Address (address_type, street_num, street, unit, city, state, zip_code, country) VALUES
            {insert_address_data};
            """
            query_loading_customer = f"""
            INSERT INTO Customer (first_name, last_name, profile_url, address_id) VALUES
            {insert_customer_data};
            """
            exec(conn, query_loading_address)
            exec(conn, query_loading_customer)
            
            username = ['John','Mary','David','James','Robert','Jennifer','Linda','Barbara','Susan','Margaret']
            password = '123456'
            user_values = []
            for i in range(test_size):
                username_random = random.choice(username) + str(random.randint(1, test_size * 1000))
                user_values.append("('{}', '{}', {})".format(username_random, generate_password_hash(password), i + 1))
                if i == 0:
                    test_username = username_random
                    test_password = "123456"
            insert_user_data = ','.join(user_values)
            query_loading_user = f"""
            INSERT INTO User (username, password_hash, customer_id) VALUES
            {insert_user_data};
            """
            exec(conn, query_loading_user)
            
            serviceStatus = ['active','inactive']
            serviceLocation_values = []
            for i in range(test_size):
                customer_id_random = random.randint(1,test_size)
                # serviceAddressID_random = random.randint(1,test_size)
                address_id_random = (2 * i) + 2
                start_date_random = str(random.randint(2010, 2023))+'-'+str(random.randint(1,12))+'-'+str(random.randint(1,28))
                square_ft_random = random.randint(500,3000)
                bedroom_num_random = random.randint(1,5)
                occupant_num_random = random.randint(1,5)
                service_status_random = random.choice(serviceStatus)
                serviceLocation_values.append("({}, {}, '{}', {}, {}, {}, '{}')".format
                                              (customer_id_random, address_id_random, start_date_random, square_ft_random, 
                                               bedroom_num_random, occupant_num_random, service_status_random))
            insert_serviceLocation_data = ','.join(serviceLocation_values)
            query_loading_servicelocation = f"""
            INSERT INTO ServiceLocation (customer_id, address_id, start_date, square_ft, bedroom_num, occupant_num, service_status) VALUES
            {insert_serviceLocation_data};
            """
            
            exec(conn, query_loading_servicelocation)
            
            enrolled_status = ['enabled','disabled']
            enrolled_device_name = ['Jack','Mary','David','James','Robert','Jennifer','Linda','Barbara','Susan','Margaret']
            enrolled_devices_values = []
            for i in range(15 * test_size):
                enrolled_device_name_random = random.choice(enrolled_device_name) + str(random.randint(1,test_size*10000))
                device_id_random = random.randint(1,20)
                service_location_id_random = random.randint(1,test_size)
                enrolled_status_random = random.choice(enrolled_status)
                enrolled_devices_values.append("('{}',{}, {}, '{}')".format(enrolled_device_name_random, device_id_random, service_location_id_random, enrolled_status_random))
            insert_enrolled_devices_data = ','.join(enrolled_devices_values)
            query_loading_enrolledDevices = f"""
            INSERT INTO EnrolledDevice (name, device_id, service_location_id, enrolled_status) VALUES
            {insert_enrolled_devices_data};
            """
            exec(conn, query_loading_enrolledDevices)
            
            enrolled_device_event_values = []
            for i in range(15*test_size):
                hour = random.randint(0,23)
                hour = str(hour) if hour >= 10 else '0' + str(hour)
                minute = random.randint(0,59)
                minute = str(minute) if minute >= 10 else '0' + str(minute)
                second = random.randint(0,59)
                second = str(second) if second >= 10 else '0'+ str(second)
                event_time_random = str(random.randint(2021,2022)) + '-' + str(random.randint(1,12)) + '-' + str(random.randint(1,28)) + ' ' + hour + ':' + minute + ':' + second
                event_value_random = round(random.uniform(3, 10), 2)
                enrolled_device_event_values.append("({}, {}, '{}', {})".format(i+1, 1, event_time_random, event_value_random))
            
            insert_enrolled_device_event_data = ','.join(enrolled_device_event_values)
            query_loading_enrolledDeviceEvent = f"""
            INSERT INTO EnrolledDeviceEvent (enrolled_device_id, event_id, time, value) VALUES
            {insert_enrolled_device_event_data};
            """
            exec(conn, query_loading_enrolledDeviceEvent)
            conn.commit()
            return jsonify({'success': True, 'username': test_username, 'password': test_password}), 201
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()