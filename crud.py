"""  ####   CRUD Funcitons   ####"""

from model import db, User, Save, Plant, connect_to_db
from flask import redirect, url_for


def new_game_plant(name, price, base_return):
    plant = Plant(name=name, price=price, base_return=base_return)
    return plant


def create_user(username, password, email):
    user = User(user_name=username, user_password=password, user_email=email, gems=0)
    return user


def get_base_plants():
    plants = Plant.query.all()
    return plants


def get_user_save(user):
    user_save = Save.query.filter(Save.user_id == user.user_id).first()
    if user_save:
        return user_save
    else:
        return redirect(url_for("/newgame"))


def get_user_by_id(user_id):
    return User.query.filter(User.user_id == user_id).first


""" #      Server Methods       # """
if __name__ == "__main__":
    from server import app

    connect_to_db(app)
