from flask import Flask, render_template
import pymysql 
from flask_cors import CORS
from api.customer_service_api import customer_service_configure_routes
from api.view_api import view_configure_routes
from api.create_table_api import create_table_configure_routes
from api.addEnrolledDeviceEvent_api import addEnrolledDeviceEvent_configure_routes

#initialize the flask app
app = Flask(__name__)

# handle CORS, so the port 3000 can communicate with the port 5000 
CORS(app)

# API routes configuration
customer_service_configure_routes(app)
view_configure_routes(app)
create_table_configure_routes(app)
addEnrolledDeviceEvent_configure_routes(app)

# connect to the MySQL database configuration
def get_db_connection():
    config = {
        'host': 'localhost',
        'user': 'root',
        'database': 'shems_test1',
        'charset': 'utf8mb4',
    }
    return pymysql.connect(**config)

@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True,threaded=True) 
    # enable the multi-threading for better performance
