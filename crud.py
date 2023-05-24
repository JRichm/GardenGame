"""  ####   CRUD Funcitons   ####"""

from model import db, User, Save, Plant, Upgrade, connect_to_db
from flask import redirect, url_for, flash
from sqlalchemy import desc, asc
from datetime import datetime
import colorsys
import random
import json


def create_save(user_id):
    save = Save(
        user_id=user_id,
        map_level=0,
        current_currency=500,
        leaves_per_second=0,
        map_data=None,
        upgrades=None,
        last_login=datetime.now(),
        total_leaves_earned="0",
    )

    db.session.add(save)
    db.session.commit()
    return save


# users
def create_user(username, password, email):
    hue = random.random()
    color = colorsys.hsv_to_rgb(hue, 0.75, 0.75)
    hex = "{:02x}{:02x}{:02x}".format(
        int(color[0] * 255), int(color[1] * 255), int(color[2] * 255)
    )
    user = User(
        username=username,
        email=email,
        password=password,
        color=hex,
        experience=0,
        total_currency=0,
        gems=0,
        total_leaves_earned=0,
    )

    return user


def get_users():
    return User.query.all()


def get_user_by_id(user_id):
    print(f"\n\n\n\n\n\nthis is my user id {User.query.all()}")
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
            "total_leaves_earned": user_save.total_leaves_earned,
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


# upgrades
def new_game_upgrade(name, price, description, page):
    upgrade = Upgrade(name=name, price=price, description=description, page=page)
    return upgrade


def get_upgrades_JSON():
    upgrades = Upgrade.query.all()
    upgrade_list = []

    for upgrade in upgrades:
        upgrade_list.append(
            {
                "upgrade_id": upgrade.upgrade_id,
                "name": upgrade.name,
                "price": upgrade.price,
                "description": upgrade.description,
                "page": upgrade.page,
            }
        )

    return json.dumps(upgrade_list)


# saves
def get_save_by_map_id(map_id):
    save = Save.query.filter(Save.map_id == map_id).first()
    return save


def update_map_save(
    map_id,
    new_map_data,
    current_currency,
    leaves_per_second,
    last_login,
    total_leaves_earned,
):
    print(f"\n\n\n\n\nupdating map {map_id}")
    save = Save.query.get(map_id)

    if save:
        save.map_data = new_map_data
        save.current_currency = current_currency
        save.leaves_per_second = leaves_per_second
        save.last_login = datetime.fromtimestamp(last_login / 1000)

        total_leaves_earned = int(total_leaves_earned)

        print(
            f"\n\n\n\n\n\n\n\n\n updating map, total leaves earned: {total_leaves_earned}"
        )

        save.total_leaves_earned = str(
            int(save.total_leaves_earned) + total_leaves_earned
        )

        save.user.total_leaves_earned = str(
            int(save.user.total_leaves_earned) + total_leaves_earned
        )

        db.session.commit()
        return "Success: Map data updated."
    else:
        return "Error: Save not found."

    return "success!"


def get_leaderboard_data(page_number):
    page_size = 5
    offset = (int(page_number) - 1) * page_size

    scores = (
        Save.query.order_by(asc(Save.total_leaves_earned))
        .limit(page_size)
        .offset(offset)
        .all()
    )

    return scores


""" #      Server Methods       # """
if __name__ == "__main__":
    from server import app

    connect_to_db(app)
