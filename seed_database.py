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

# delete db to start fresh
os.system("dropdb -U jamcam gardengame")
os.system("createdb -U jamcam gardengame")

# create tables from model.py
with app.app_context():
    model.connect_to_db(server.app)
    model.db.create_all()

# add base plants.json data to database
with open("data/plants.json") as p:
    plant_data = json.loads(p.read())
plants_in_db = []
for page in plant_data:
    for plant in page:
        name, price, base_return, color, stage = (
            plant["name"],
            plant["price"],
            plant["base_return"],
            plant["color"],
            plant["stage"],
        )
        db_plant = crud.new_game_plant(name, price, base_return, color, stage)
        plants_in_db.append(db_plant)


# add base upgrades.json data to database
with open("data/upgrades.json") as u:
    upgrade_data = json.loads(u.read())
upgrades_in_db = []
for page in upgrade_data:
    for upgrade in page:
        name, price, description, color, page = (
            upgrade["name"],
            upgrade["price"],
            upgrade["description"],
            upgrade["color"],
            upgrade["page"],
        )
        db_upgrade = crud.new_game_upgrade(name, price, description, color, page)
        upgrades_in_db.append(db_upgrade)

# commit changes
with app.app_context():
    model.db.session.add_all(plants_in_db)
    model.db.session.add_all(upgrades_in_db)
    model.db.session.commit()
