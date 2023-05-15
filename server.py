""" ####    Server File     #### """
from flask import Flask, render_template, flash, session, request, redirect, url_for
from model import connect_to_db, db
from jinja2 import StrictUndefined
import crud

app = Flask(__name__)
app.secret_key = "garden"
app.jinja_env.undefined = StrictUndefined


""" ####    Flask Routes    #### """


#      View Homepage       #
@app.route("/")
def homepage():
    base_plants = crud.get_base_plants()
    return render_template("game.html", base_plants=base_plants)


#      Get Plant Data      #
@app.route("/gameplantinfo/<plant_id>")
def get_plant_info(plant_id):
    return crud.game_plant_info(plant_id)


""" ####   Server Methods   #### """
if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
