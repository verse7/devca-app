import os
import jwt
import csv
from functools import wraps
from flask import render_template, request, jsonify
from app import app, db, csrf
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash
from app.forms import *
from app.models import *
from app.arawak_python_sdk import *

###
# Utility functions
###

# jwt decorator
def auth_required(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    auth = request.headers.get('Authorization', None)
    if not auth:
      return jsonify({'code': 'authorization_header_missing', 'description': 'Authorization header is expected'}), 401

    parts = auth.split()

    if parts[0].lower() != 'bearer':
      return jsonify({'code': 'invalid_header', 'description': 'Authorization header must start with Bearer'}), 401
    elif len(parts) == 1:
      return jsonify({'code': 'invalid_header', 'description': 'Token not found'}), 401
    elif len(parts) > 2:
      return jsonify({'code': 'invalid_header', 'description': 'Authorization header must be Bearer + \s + token'}), 401

    token = parts[1]
    try:
         payload = jwt.decode(token, app.config['SECRET_KEY'])

    except jwt.ExpiredSignature:
        return jsonify({'code': 'token_expired', 'description': 'token is expired'}), 401
    except jwt.DecodeError:
        return jsonify({'code': 'token_invalid_signature', 'description': 'Token signature is invalid'}), 401

    return f(*args, **kwargs)

  return decorated

def form_errors(form):
    error_messages = []
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages

###
# API endpoints
###
@app.route('/api/register', methods=['POST'])
def register():
  form = RegistrationForm()
  if form.validate_on_submit() == True:
    firstname = form.firstname.data
    lastname = form.lastname.data
    email = form.email.data
    password = form.password.data

    try:
      user = User(firstname, lastname, email, password)
      db.session.add(user)
      db.session.commit()

      success = "User sucessfully registered"
      return jsonify(message=success), 201

    except Exception as e:
      print(e)
      db.session.rollback()  #Remove the failed commit that occurred
      return jsonify(error="An error occured with the server. Try again!"), 401

  return jsonify(error="Error: Invalid/Missing user information"), 401

@app.route('/api/auth/login', methods=['POST'])
def login():
  form = LoginForm()
  if form.validate_on_submit() == True:
    email = form.email.data
    password = form.password.data

    user = db.session.query(User).filter_by(email=email).first()

    if user is not None and check_password_hash(user.password, password):

      #create bearer token
      payload = {'userid': user.id}
      jwt_token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256').decode('utf-8')

      success = "User successfully logged in."
      return jsonify(message=success, token=jwt_token, user_id=user.id)

    return jsonify(error="Incorrect email or password"), 401
  
  return jsonify(error="Failed to login user"), 401


@app.route('/api/bookables', methods=['POST'])
@csrf.exempt
def bookables():
    form = BookingForm()

    if form.validate_on_submit():
        booking = BookableAndBooking()

        data = booking.getFreeBookablesByIntervalDate('j8sEimoBSf6a6E5BcOFf', form.startDate.data, form.endDate.data).decode('utf-8')
        status = 200
    else:
      data = form_errors(form)
      status = 400

    return jsonify(data), status


@app.route('/api/bookables/<bookableId>', methods=['GET'])
def bookable(bookableId):
    bookable = BookableAndBooking()
    
    data = bookable.getBookableById(bookableId).decode('utf-8')

    return jsonify(data), 200

@app.route('/api/media/<filename>', methods=['GET'])
def media(filename):
    media = Media()
    data = media.getMediaFile(filename).decode('utf-8')

    return jsonify(data), 200

@app.route('/api/resources', methods=['GET'])
def resources():
  try:
    with open('./app/static/assets/treasure-beach-entity_data.csv', encoding="utf8", errors='ignore') as csvfile:
      reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
      header = next(reader)
      
      events = []
      for row in reader:
        events.append(row)

    csvfile.close()
    events, status_code = events, 200
  except:
    events, status_code = [], 400
    
  return jsonify(events), 200

###
# This route yields control to vue
###
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    return render_template('index.html')

###
# The functions below should be applicable to all Flask apps.
###

#Save the uploaded photo to a folder
def assignPath(upload):
  filename = secure_filename(upload.filename)
  upload.save(os.path.join(
              app.config['UPLOAD_FOLDER'], filename
  ))
  return filename

@app.route('/<file_name>.txt')
def send_text_file(file_name):
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")
