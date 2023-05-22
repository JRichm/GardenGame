"""  ####   CRUD Funcitons   ####"""

from model import db, User, Save, Plant, connect_to_db
from flask import redirect, url_for, flash
from sqlalchemy import desc
from datetime import datetime
import json


def create_save(user_id):
    save = Save(
        user_id=user_id,
        map_level=0,
        current_currency=100,
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
def new_game_plant(name, price, base_return, color, stage):
    plant = Plant(
        name=name, price=price, base_return=base_return, color=color, stage=stage
    )
    return plant


def get_base_plants_JSON():
    plants = Plant.query.all()
    plant_list = []

    for plant in plants:
        plant_list.append(
            {
                "plant_id": plant.plant_id,
                "name": plant.name,
                "price": plant.price,
                "base_return": plant.base_return,
                "color": plant.color,
                "stage": plant.stage,
            }
        )
    return json.dumps(plant_list)


def get_base_plant(plant_id):
    plant = Plant.query.filter(Plant.plant_id == plant_id).first()
    base_plant = {
        "plant_id": plant.plant_id,
        "name": plant.name,
        "price": plant.price,
        "base_return": plant.base_return,
        "color": plant.color,
        "stage": plant.stage,
    }
    return base_plant


# saves
def get_save_by_map_id(map_id):
    save = Save.query.filter(Save.map_id == map_id).first()
    return save


def update_map_save(map_id, new_map_data, current_currency, leaves_per_second):
    print("\n\n\n\n\nupdating map")
    print(map_id)
    print(new_map_data)

    save = Save.query.get(map_id)
    if save:
        save.map_data = new_map_data
        save.current_currency = current_currency
        save.leaves_per_second = leaves_per_second
        db.session.commit()
        return "Success: Map data updated."
    else:
        return "Error: Save not found."

    return "success!"


def get_leaderboard_data(page_number):
    page_size = 5
    offset = (int(page_number) - 1) * page_size

    scores = (
        Save.query.order_by(desc(Save.current_currency))
        .limit(page_size)
        .offset(offset)
        .all()
    )

    return scores


""" #      Server Methods       # """
if __name__ == "__main__":
    from server import app

    connect_to_db(app)
