import os
import pymysql
from flask import jsonify, request, send_from_directory

UPLOAD_FOLDER = 'uploads/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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

def profile_configure_routes(app):
    # Gets customer's profile picture in Customer Database by <cID>
    @app.route('/api/setUploadImage', methods=['PUT'])
    def set_upload_image():
        try:
            if 'file' not in request.files:
                return jsonify({'error': 'No file sent'}), 400
            
            cID = request.form.get('cID')
            file = request.files['file']
            
            if not file or file.filename == '':
                return jsonify({'error': 'No selected file'}), 400
            
            filename = f"{cID}_{file.filename}"
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)
            
            conn = get_db_connection()
            with conn.cursor() as cursor:
                query = """UPDATE Customer SET cProfileURL = %s WHERE cID = %s"""
                cursor.execute(query, (filepath, cID))
                conn.commit()
            return jsonify({'message': 'Image uploaded successfully', 'cProfileURL': filepath}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500

    # Gets customer's profile picture in Customer Database by <cID>
    @app.route("/api/getUploadImage/", methods=['GET'])
    def get_upload_image():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cursor:
                cID = request.args.get("cID")
                if not cID:
                    return jsonify({'message': 'Missing cID parameter'}), 400

                query = """SELECT cProfileURL FROM Customer WHERE cID = %s;"""
                cursor.execute(query, (cID,))
                result = cursor.fetchone()
                if not result:
                    return jsonify({'message': f'No customer found with cID={cID}'}), 404

                cProfileURL = result['cProfileURL']
                return jsonify({
                    'cProfileURL': str(cProfileURL),
                    'message': f'Image with path {cProfileURL} retrieved successfully'
                }), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            if conn:
                conn.close()

    # Serves a file from uploads directory with name <filename>
    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory(UPLOAD_FOLDER, filename)