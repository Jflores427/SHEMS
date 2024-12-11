from datetime import timedelta
from flask import Flask, render_template
import pymysql 
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from api.customer_service_api import customer_service_configure_routes
from api.view_api import view_configure_routes
from api.create_table_api import create_table_configure_routes
from api.addEnrolledDeviceEvent_api import addEnrolledDeviceEvent_configure_routes
from dotenv import load_dotenv
import os


load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET_KEY")

#initialize the flask app
app = Flask(__name__)

app.config['SECRET_KEY'] = SECRET_KEY

# app.config["JWT_SECRET_KEY"] = "your_jwt_secret"


# # 1 Hour Access Token Expiration Period
# app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

# # # Enable Cookies with HTTPS
# # app.config["JWT_COOKIE_SECURE"] = False

# # app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
# # app.config["JWT_ACCESS_COOKIE_NAME"] = "jwtToken"


# app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
# app.config["JWT_COOKIE_SECURE"] = False
# app.config["JWT_COOKIE_CSRF_PROTECT"] = False  # Disable for testing only
# app.config["JWT_COOKIE_DOMAIN"] = "localhost"
# app.config["JWT_ACCESS_COOKIE_PATH"] = "/"
# # app.config["JWT_REFRESH_COOKIE_PATH"] = "/api/refresh-token"

# CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:5173"}})

# handle CORS, so the port 3000 can communicate with the port 5000 
# CORS(app, supports_credentials=True)


# app.config["JWT_SECRET_KEY"] = "your_secret_key"  # Change this in production
# app.config["JWT_TOKEN_LOCATION"] = ["headers", "cookies"]
# app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
# app.config["JWT_COOKIE_SECURE"] = False  # Set to True in production with HTTPS
# app.config["JWT_COOKIE_SAMESITE"] = "Lax"  # Required for cross-origin cookies
# app.config["JWT_HEADER_NAME"] = "Authorization"
# app.config["JWT_HEADER_TYPE"] = "Bearer"
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:5173"}})

# jwt = JWTManager(app)

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
