from flask_wtf import FlaskForm
from wtforms import PasswordField, StringField, RadioField, validators
from flask import session, flash, redirect, render_template, url_for
from model import connect_to_db, db
import crud


""" #                 Flask Forms                  # """


# login form
class LoginForm(FlaskForm):
    username = StringField("Username", [validators.InputRequired()])
    password = PasswordField("Password", [validators.InputRequired()])

    def login_user(self):
        if self.validate_on_submit():
            # user input data
            username = self.username.data
            password = self.password.data

            # get user obj using username
            user = crud.get_user_by_username(username)

            # check if user exists and if password is correct
            if not user or user.password != password:
                flash("Incorrect password", "danger")
                return redirect("/")

            # store username in session to keep track of logged in user
            session["gg_user_id"] = user.user_id
            flash(f"{user.username} Successfully Logged In!", "success")
            return redirect(f"/mygame")

        # form has not been submitted or data was not valid
        print("\tSomething Wen't Wrong")
        return render_template("homepage.html")


# create account form
class CreateAccoutForm(FlaskForm):
    username = StringField("username", [validators.InputRequired()])
    email = StringField("email", [validators.InputRequired()])
    password = PasswordField("password", [validators.InputRequired()])

    def create_user(self):
        # user input data
        username = self.username.data
        email = self.email.data
        password = self.password.data
        
        #check password length
        if len(password) <= 5:
            flash('Password too short! Try again!', "danger")
            return redirect(url_for('homepage'))

        # create user if username or email arent already in db
        if not crud.get_user_by_email(email):
            if not crud.get_user_by_username(username):
                new_user = crud.create_user(username, password, email)
                db.session.add(new_user)
                db.session.commit()

                # get user id and log in user
                session["gg_user_id"] = crud.get_user_by_email(email).user_id
                flash("Successfully created account!", "success")
                return redirect("/newgame")
            else:
                flash(f"Username {username} already in use! Try again.", "danger")
        else:
            flash("Invalid Email! Try logging in or enter a different email address.", "danger")

        return redirect(url_for("homepage"))
    
    
# change password form
    # need to input email and previous password to change
        # email
        # current password
        # new password

# change username form
    # need to input current username and password to change
        # current username
        # new username
        # password

# change email form
    # need to input current email and password to change
        # current email
        # new email
        # password

# delete account form
    # need to input username and password to change
        # email
        # password
        
class DeleteAccountForm(FlaskForm):
    email = StringField("email", [validators.InputRequired()])
    password = PasswordField("password", [validators.InputRequired()])
    
    def deleteAccount(self):
        
        #user input data
        email = self.email.data
        password = self.password.data
        
        # get session user
        sessionUser = crud.get_user_by_id(session["gg_user_id"])
        
        # get user by email that user entered
        inputUser = crud.get_user_by_email(email)
        
        # check if user ID's match
        if sessionUser.user_id != inputUser.user_id:
            flash('Emails do not match! Try Again!', 'danger')
            return redirect(url_for('homepage'))
        
        # check if session user matches user under the input email
        if email != sessionUser.email:
            flash('Emails do not match! Try Again!', 'danger')
            return redirect(url_for('homepage'))
        
        if password != sessionUser.password:
            flash('Passwords do not match! Try Again!', 'danger')
            return redirect(url_for('homepage'))
        
        crud.delete_account_by_id(sessionUser.user_id)
        flash('Account deleted successfully', 'success')
        return redirect(url_for('homepage'))
        