""" Script for seeding databse. """

import os
import json
import string
import random
from datetime import datetime

import crud
import model
import server
from server import app

os.system("dropdb -U jamcam gardengame")
os.system("createdb -U jamcam gardengame")

with app.app_context():
    model.connect_to_db(server.app)
    model.db.create_all()

with open("data/plants.json") as f:
    plant_data = json.loads(f.read())

plants_in_db = []
for page in plant_data:
    for plant in page:
        name, price, base_return, color = (
            plant["name"],
            plant["price"],
            plant["base_return"],
            plant["color"],
        )
        db_plant = crud.new_game_plant(name, price, base_return, color)
        plants_in_db.append(db_plant)

with app.app_context():
    model.db.session.add_all(plants_in_db)
    model.db.session.commit()
