""" ####    Server File     #### """
from flask import Flask, render_template, flash, session, request, redirect, url_for
from model import connect_to_db, db
from jinja2 import StrictUndefined
import crud
import forms

app = Flask(__name__)
app.secret_key = "garden"
app.jinja_env.undefined = StrictUndefined


""" ####    Flask Routes    #### """


#      View Homepage       #
@app.route("/")
def homepage():
    logged_in = session.get("user_id") is not None
    return render_template("login.html", form=forms.LoginForm(), username=check_login())


#        Open Game         #
@app.route("/mygame")
def open_game():
    user = crud.get_user_by_id(session["user_id"]) is not None
    if user:
        users_game = crud.get_user_save(user)
        return render_template("game.html", myGame=users_game, user=user)
    else:
        return redirect(url_for("/"))


#      Get Plant Data      #
@app.route("/gameplantinfo/<plant_id>")
def get_plant_info(plant_id):
    return crud.game_plant_info(plant_id)


""" ####   Server Methods   #### """


def check_login():
    session["user_id"] = session.get("user_id") or None
    return (
        crud.get_user_by_id(session["user_id"]).user_name
        if session["user_id"]
        else None
    )


if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
