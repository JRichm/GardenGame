""" Models for garden clicker game """

from flask_sqlalchemy import SQLAlchemy
import os

db = SQLAlchemy()

"""  ####   Table Modlels   ####  """

##           User Model
class User(db.Model):
    __tablename__ = 'users'
    
    user_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    username = db.Column(db.String(), unique=True, nullable=False)
    email = db.Column(db.String(), nullable=True)
    password = db.Column(db.String(), nullable=False)
    gems = db.Column(db.Integer(), nullable=False)
    
    def __repr__(self):
        return f'<User Data:\n\t{self.username}\n\t{self.email}\n\tgems: {self.gems}>'
    
    
##          Save Model
class Save(db.Model):
    __tablename__ = 'saves'
    
    map_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('users.user_id'), nullable=False)
    map_level = db.Column(db.integer(), nullable=False, autoincrement=True)
    current_currency = db.Column(db.integer(), nullable=False)
    leaves_per_second = db.Column(db.integer(), nullable=False)
    upgrades = db.Column(db.String(), nullable=False)
    purchases = db.Column(db.String(), nullable=False)
    last_login = db.Column(db.DateTime(), nullable=False)
    
    def __repr__(self):
        return f'<Map Data:\n\tUser: {self.user_id} - Map: {self.map_id}\n\t${self.current_currency}  @  ${self.leaves_per_second} per second\n\tLast login: {self.last_login}>'
    
    
##          Sprite Model
class Sprite(db.Model):
    __tablename__ = 'sprites'
    
    sprite_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    name = db.Column(db.String(), unique=True, nullable=False)
    img_url = db.Column(db.String(), unique=True, nullable=False)
    
    def __repr__(self):
        return f'<Sprite Data:\n\t{self.name} ({self.sprite_id})\n\t{self.img_url}>'
    
    
##          Entity Type Model
class EntityType(db.Model):
    __tablename__ = 'entity_types'
    
    type_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    name = db.Column(db.String(), unique=True, nullable=False)
    base_value = db.Column(db.Integer(), nullable=False)
    multiplier = db.Column(db.Decimal(), nullable=False)
    
    def __repr__(self):
        return f'<Type Data:\n\t{self.name}\t({self.base_value}, {self.multiplier})'
    
    
##          Entity Model
class Entity(db.Model):
    __tablename__ = 'entities'
    
    entity_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    name = db.Column(db.String(), unique=True, nullable=False)
    level = db.Column(db.Integer(), nullable=False)
    entity_type_id = db.Column(db.Integer(), db.ForeignKey('entity_types.type_id'), nullable=False)
    img_url_id = db.Column(db.Integer(), db.ForeignKey('sprites.sprite_id'), nullable=False)