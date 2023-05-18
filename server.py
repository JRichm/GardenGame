""" ####    Server File     #### """

from flask import (
    Flask,
    render_template,
    flash,
    session,
    request,
    redirect,
    url_for,
    send_from_directory,
)
from model import connect_to_db, db
from jinja2 import StrictUndefined
import json
import os
import crud
import forms

app = Flask(__name__)
app.secret_key = "garden"
app.jinja_env.undefined = StrictUndefined


"""#  -   -   -   -   -   -   -   -  #"""
"""   -        Page Routes        -   """
"""#  -   -   -   -   -   -   -   -  #"""


##     """ View Homepage """     ##
@app.route("/")
def homepage():
    return render_template("login.html", form=forms.LoginForm(), user=check_login())


##      """  User Login  """     ##
@app.route("/login", methods=["GET", "POST"])
def login():
    form = forms.LoginForm(request.form)
    return form.login_user()


##   """ View Leaderboards """   ##
@app.route("/leaderboards")
def view_leaderboards():
    return render_template("leaderboards.html", user=check_login())


"""#  -   -   -   -   -   -   -   -  #"""
"""   -        User Routes        -   """
"""#  -   -   -   -   -   -   -   -  #"""


##      """   New User   """     ##
@app.route("/users", methods=["POST"])
def register_user():
    form = forms.CreateAccoutForm(request.form)
    return form.create_user()


##      """  User Logout """     ##
@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("homepage"))


"""#  -   -   -   -   -   -   -   -  #"""
"""   -        Game Routes        -   """
"""#  -   -   -   -   -   -   -   -  #"""


#         New Game         #
@app.route("/newgame")
def new_game():
    if check_login():
        user_id = session.get("gg_user_id")
        users_game = crud.get_user_save_JSON(user_id)
        if not users_game:
            users_game = crud.create_save(user_id)
        return redirect("/mygame")
    else:
        flash("Please log in to create a new game!")
        return redirect(url_for("homepage"))


#        Open Game         #
@app.route("/mygame")
def open_game():
    if check_login():
        users_game_list = json.loads(crud.get_user_save_JSON(session.get("gg_user_id")))
        users_game = users_game_list[0]
        if users_game is not None:
            session["map_id"] = users_game["map_id"]
            user = crud.get_user_by_id(session.get("gg_user_id"))
            plants = json.loads(crud.get_base_plants_JSON())
            return render_template(
                "game.html", user_save=users_game, user=user, base_plants=plants
            )
        else:
            return redirect("/newgame")
    else:
        flash(f"Please log in to view your garden!")
        return redirect(url_for("homepage"))


#        Save Game         #
@app.route("/savegame/<map_id>", methods=["POST"])
def save_game(map_id):
    if check_login():
        save = crud.get_save_by_map_id(map_id)
        if save.user_id == session.get("gg_user_id"):
            new_map_data = request.json.get("map_data")
            current_currency = request.json.get("current_currency")
            return crud.update_map_save(map_id, new_map_data, current_currency)


#      Get Plant Data      #
@app.route("/gameplantinfo/<plant_id>")
def get_plant_info(plant_id):
    print(f"searching for plant @ {plant_id}")
    plant = crud.get_base_plant(plant_id)
    if plant:
        return plant
    else:
        return


#      Get Base Plants     #
@app.route("/getbaseplants")
def get_base_plants():
    plants = crud.get_base_plants_JSON()
    return plants


"""#  -   -   -   -   -   -   -   -  #"""
"""   -      Server Methods       -   """
"""#  -   -   -   -   -   -   -   -  #"""


#          Favicon         #
@app.route("/favicon.ico")
def favicon():
    return send_from_directory(app.static_folder, "favicon.png")


def check_login():
    session["gg_user_id"] = session.get("gg_user_id") or None
    user = crud.get_user_by_id(session["gg_user_id"])
    if user:
        return user
    else:
        return None


if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
