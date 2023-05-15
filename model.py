""" Models for garden clicker game """

from flask_sqlalchemy import SQLAlchemy
import os

db = SQLAlchemy()

"""  ####   Table Modlels   ####  """


##           User Model
class User(db.Model):
    __tablename__ = "users"

    user_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    username = db.Column(db.String(), unique=True, nullable=False)
    email = db.Column(db.String(), nullable=True)
    password = db.Column(db.String(), nullable=False)
    gems = db.Column(db.Integer(), nullable=False)

    def __repr__(self):
        return f"<User Data:\n\t{self.username}\n\t{self.email}\n\tgems: {self.gems}>"


##          Save Model
class Save(db.Model):
    __tablename__ = "saves"

    map_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer(), db.ForeignKey("users.user_id"), nullable=False)
    map_level = db.Column(db.Integer(), nullable=False, autoincrement=True)
    current_currency = db.Column(db.Integer(), nullable=False)
    leaves_per_second = db.Column(db.Integer(), nullable=False)
    map_data = db.Column(db.String(), nullable=False)
    upgrades = db.Column(db.String(), nullable=False)
    last_login = db.Column(db.DateTime(), nullable=False)

    user = db.relationship("User", backref="saves")

    def __repr__(self):
        return f"<Map Data:\n\tUser: {self.user_id} - Map: {self.map_id}\n\t${self.current_currency}  @  ${self.leaves_per_second} per second\n\tLast login: {self.last_login}>"


##          Plant Game Object
class Plant(db.Model):
    __tablename__ = "base_plants"

    plant_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    name = db.Column(db.String(), unique=True, nullable=False)
    price = db.Column(db.Integer(), nullable=False)
    base_return = db.Column(db.Integer(), nullable=False)


"""  ####     DB Config     ####  """


def connect_to_db(flask_app, db_uri="postgresql:///gardengame", echo=True):
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["POSTGRES_URI"]
    flask_app.config["SQLALCHEMY_ECHO"] = echo
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.app = flask_app
    db.init_app(flask_app)

    print("Connected to the db!")


if __name__ == "__main__":
    from server import app

    # Call connect_to_db(app, echo=False) if your program output gets
    # too annoying; this will tell SQLAlchemy not to print out every
    # query it executes.

    connect_to_db(app)
