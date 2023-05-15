from flask_wtf import FlaskForm
from wtforms import PasswordField, StringField, RadioField, validators
from flask import session, flash, redirect, render_template
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
            if not user or user.user_password != password:
                flash("Incorrect password", "danger")
                return redirect("/")

            # store username in session to keep track of logged in user
            session["user_id"] = user.user_id
            flash("Successfully Logged In!", "success")
            return redirect("/movies")

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

        # create user if username or email arent already in db
        if not crud.get_user_by_email(email):
            if not crud.get_user_by_username(username):
                new_user = crud.create_user(username, password, email)
                db.session.add(new_user)
                db.session.commit()

                # get user id and log in user
                session["user_id"] = crud.get_user_by_email(email).user_id
                flash("Successfully created account!", "success")
                return redirect("/movies")
            else:
                flash(f"Username {username} already in use! Try again.", "danger")
        else:
            flash(
                "Invalid Email! Try logging in or enter a different email address.",
                "danger",
            )

        return redirect("/")

    # rate movie form


class RateMovieForm(FlaskForm):
    options = RadioField(
        "Rate this movie!",
        choices=[("1", "1"), ("2", "2"), ("3", "3"), ("4", "4"), ("5", "5")],
    )

    def add_rating(self, movie_id, user_id):
        # check to see if user and movie id's have been captured
        if user_id or crud.get_user_by_id(user_id):
            if movie_id and crud.get_movie_by_id(movie_id):
                score = self.options.data
                rating = crud.get_rating(movie_id, user_id)

                # if user has not rated the movie before
                if not rating:
                    new_rating = crud.create_rating(user_id, movie_id, score)
                    db.session.add(new_rating)
                    flash(
                        f"get_rating({movie_id}, {user_id}):\n{crud.get_rating(movie_id, user_id)}"
                    )

                # if user has already submited a rating for this movie
                else:
                    old_rating = crud.get_rating(movie_id, user_id)
                    old_rating.rating_score = score
                    flash(
                        f"get_rating({movie_id}, {user_id}):\n{crud.get_rating(movie_id, user_id)}"
                    )

                flash(
                    f"{crud.get_user_by_id(user_id).user_name} rated {crud.get_movie_by_id(movie_id).movie_title} with a score of {score} out of 5",
                    "success",
                )
                db.session.commit()

            else:
                flash("Error rating movie! Try again.", "danger")
        else:
            flash("Log in to rate movies!", "danger")

        return redirect(f"/movies/{movie_id}")
