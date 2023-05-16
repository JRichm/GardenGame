"""  ####   CRUD Funcitons   ####"""

from model import db, User, Save, Plant, connect_to_db
from flask import redirect, url_for
from datetime import datetime


def new_game_plant(name, price, base_return):
    plant = Plant(name=name, price=price, base_return=base_return)
    return plant


def create_user(username, password, email):
    user = User(username=username, password=password, email=email, gems=0)
    return user

def create_save(user_id):
    save = Save(user_id=user_id,
                map_level=0,
                current_currency=0,
                leaves_per_second=0,
                map_data=None,
                upgrades=None,
                last_login=datetime.now())
    return save;

def get_base_plants():
    plants = Plant.query.all()
    return plants


# users
def get_users():
    return User.query.all()


def get_user_by_id(user_id):
    return User.query.get(user_id)


def get_user_by_email(email):
    return User.query.filter(User.email == email).first()


def get_user_by_username(username):
    return User.query.filter(User.username == username).first()


def get_user_save(user_id):
    user_save = Save.query.filter(Save.user_id == user_id).first()
    if user_save:
        return user_save
    else:
        return redirect(f"/newgame/{user_id}")


""" #      Server Methods       # """
if __name__ == "__main__":
    from server import app

    connect_to_db(app)
