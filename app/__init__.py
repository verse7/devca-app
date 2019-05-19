from flask import Flask
from flask_wtf.csrf import CSRFProtect
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
csrf = CSRFProtect(app)
app.config['UPLOAD_FOLDER'] = './app/static/uploads'
app.config['SECRET_KEY'] = 'v\xf9\xf7\x11\x13\x18\xfaMYp\xed_\xe8\xc9w\x06\x8e\xf0f\xd2\xba\xfd\x8c\xda'
# DATABASE_URL = 'postgresql://admin:password123@localhost/devca'
DATABASE_URL='postgres://dgkrabdgfaaxsv:cdb42fc6684be99aad789c19d3bdc1baa61a7e7f4b4c18b16aba85ac5743fb33@ec2-23-21-129-125.compute-1.amazonaws.com:5432/de5quhgjuh1m7d'

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db = SQLAlchemy(app)

from app import views, models
