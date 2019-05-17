from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import StringField, SelectField, TextAreaField, PasswordField
from wtforms.fields.html5 import EmailField
from wtforms.validators import InputRequired


class LoginForm(FlaskForm):
    email = EmailField('Email', validators=[InputRequired()])
    password = PasswordField('Password', validators=[InputRequired()])

class RegistrationForm(FlaskForm):
    firstname = StringField('Firstname', validators=[InputRequired()])
    lastname = StringField('Lastname', validators=[InputRequired()])
    email = EmailField('Email', validators=[InputRequired()])
    password = PasswordField('Password', validators=[InputRequired()])
    photo = FileField('Photo', validators=[FileRequired(), FileAllowed(['png', 'jpg', 'jpeg'], 'Images Only!')])

class GenericForm(FlaskForm):
    field1 = StringField('field1', validators=[InputRequired()])
    field2 = TextAreaField('field2', validators=[InputRequired()])
    field3 = FileField('field3', validators=[FileRequired(),  FileAllowed(['jpg','jpeg', 'png', 'Only images are accepted!'])])
    