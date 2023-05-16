"""  ####   CRUD Funcitons   ####"""

from model import db, User, Save, Plant, connect_to_db
from flask import redirect, url_for
from datetime import datetime
import json


def create_save(user_id):
    save = Save(
        user_id=user_id,
        map_level=0,
        current_currency=0,
        leaves_per_second=0,
        map_data=None,
        upgrades=None,
        last_login=datetime.now(),
    )
    print("\n\n\n\n\n\n\n\nthis is my save")
    print(save)
    db.session.add(save)
    db.session.commit()
    return save


# users
def create_user(username, password, email):
    user = User(username=username, password=password, email=email, gems=0)
    return user


def get_users():
    return User.query.all()


def get_user_by_id(user_id):
    return User.query.get(user_id)


def get_user_by_email(email):
    return User.query.filter(User.email == email).first()


def get_user_by_username(username):
    return User.query.filter(User.username == username).first()


def get_user_save_JSON(user_id):
    user_save = Save.query.filter(Save.user_id == user_id).first()
    if user_save:
        user_save_dict = {
            "map_id": user_save.map_id,
            "user_id": user_save.user_id,
            "map_level": user_save.map_level,
            "current_currency": user_save.current_currency,
            "leaves_per_second": user_save.leaves_per_second,
            "map_data": user_save.map_data,
            "upgrades": user_save.upgrades,
            "last_login": str(user_save.last_login),
        }

        user_save_JSON = json.dumps([user_save_dict])
        return user_save_JSON

    else:
        return None


# plants
def new_game_plant(name, price, base_return):
    plant = Plant(name=name, price=price, base_return=base_return)
    return plant


def get_base_plants_JSON():
    plants = Plant.query.all()
    json_result = json.dumps(
        [
            {
                "plant_id": row.plant_id,
                "name": row.name,
                "price": row.price,
                "base_return": row.base_return,
            }
            for row in plants
        ],
        default=str,
    )
    return json_result


def get_base_plant(plant_id):
    plant = Plant.query.filter(Plant.plant_id == plant_id).first()
    base_plant = {
        "plant_id": plant.plant_id,
        "name": plant.name,
        "price": plant.price,
        "base_return": plant.base_return,
    }
    return base_plant


""" #      Server Methods       # """
if __name__ == "__main__":
    from server import app

    connect_to_db(app)
