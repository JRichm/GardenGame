"""  ####   CRUD Funcitons   ####"""

from model import db, User, Plant, connect_to_db


def new_game_plant(name, price, base_return):
    plant = Plant(name=name, price=price, base_return=base_return)
    return plant


def create_user(username, password, email):
    user = User(user_name=username, user_password=password, user_email=email, gems=0)
    return user


def get_base_plants():
    plants = Plant.query.all()
    return plants


""" #      Server Methods       # """
if __name__ == "__main__":
    from server import app

    connect_to_db(app)
