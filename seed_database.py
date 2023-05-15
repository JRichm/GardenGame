""" Script for seeding databse. """

import os
import json
import string
import random
from datetime import datetime

import crud
import model
import server

os.system("dropdb -U jamcam gardengame")
os.system("createdb -U jamcam gardengame")

model.connect_to_db(server.app)
model.db.create_all()

with open("data/plants.json") as f:
    plant_data = json.loads(f.read())
