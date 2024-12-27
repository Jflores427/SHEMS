from flask import Flask, render_template
from flask_cors import CORS
from api.address_api import address_configure_routes
from api.auth_api import auth_configure_routes
from api.create_table_api import create_table_configure_routes
from api.devices_api import devices_configure_routes
from api.energy_price_api import energy_price_configure_routes
from api.event_log_api import event_log_configure_routes
from api.feed_api import feed_configure_routes
from api.profile_api import profile_configure_routes
from api.register_api import register_configure_routes
from api.service_locations_api import service_locations_configure_routes
from dotenv import load_dotenv
import pymysql 
import os

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET_KEY")

# Initialize the Flask app
app = Flask(__name__)

# Configuration for Flask app
app.config['SECRET_KEY'] = SECRET_KEY
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:5173"}})

# API routes configuration
address_configure_routes(app)
auth_configure_routes(app)
create_table_configure_routes(app)
devices_configure_routes(app)
energy_price_configure_routes(app)
event_log_configure_routes(app)
feed_configure_routes(app)
profile_configure_routes(app)
register_configure_routes(app)
service_locations_configure_routes(app)

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


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    # Enable multi-threading for better performance
    app.run(debug=True,threaded=True) 
