from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import StringField, SelectField, TextAreaField, PasswordField
from wtforms.fields.html5 import EmailField, DateField
from wtforms.validators import InputRequired, DataRequired


class LoginForm(FlaskForm):
    email = EmailField('Email', validators=[InputRequired()])
    password = PasswordField('Password', validators=[InputRequired()])

class RegistrationForm(FlaskForm):
    firstname = StringField('Firstname', validators=[InputRequired()])
    lastname = StringField('Lastname', validators=[InputRequired()])
    email = EmailField('Email', validators=[InputRequired()])
    password = PasswordField('Password', validators=[InputRequired()])

class GenericForm(FlaskForm):
    field1 = StringField('field1', validators=[InputRequired()])
    field2 = TextAreaField('field2', validators=[InputRequired()])
    field3 = FileField('field3', validators=[FileRequired(),  FileAllowed(['jpg','jpeg', 'png', 'Only images are accepted!'])])
    
class BookingForm(FlaskForm):
    class Meta:
        csrf = False

    country = StringField('country', validators=[InputRequired()])
    city = StringField('city', validators=[InputRequired()])
    startDate = StringField('startDate', validators=[DataRequired()])
    endDate = StringField('endDate', validators=[DataRequired()])