from flask import Flask, render_template
import pymysql
from flask_cors import CORS
from flask import jsonify, request
from threading import Lock
from api.customer_service_api import customer_service_configure_routes
from api.view_api import view_configure_routes
from api.create_table_api import create_table_configure_routes

app = Flask(__name__)
CORS(app)
customer_service_configure_routes(app)
view_configure_routes(app)
create_table_configure_routes(app)

def get_db_connection():
    config = {
        'host': 'localhost',
        'user': 'root',
        'database': 'final_project',
        'charset': 'utf8mb4',
    }
    return pymysql.connect(**config)

@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True,threaded=True)
