from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from models import db
from routes import api_bp

def create_app():
    app = Flask(__name__)
    CORS(app) # Enable CORS for React frontend
    
    # Configure MySQL using PyMySQL
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:cris123@localhost:3306/TestDB'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    
    # Register API blueprint
    app.register_blueprint(api_bp, url_prefix='/api')
    
    with app.app_context():
        # Create all tables
        db.create_all()
        
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
