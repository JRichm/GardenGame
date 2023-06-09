# Garden Game

A fun and interactive game made for you to sit back and cultivate a peaceful garden.

# Game Overview

Garden Game allows players to create and manage their own virtual gardens. Users can plant and grown various types of plants,
earcn in-game currency, unlock new plants, and upgrade their garden for increased productivity. Users can also collect gems
as a currency and other rare collectables that can be traded with other players or spent at the shop.

# Features

Plant and grow various types of virtual plants
Earn in game currency by harvesting plants and completing tasks
Purchase upgrades and unlock new plants to enhance gardens productivity.
Save and load multiple games saves to track progress and experiment with different garden setups

# Database Schema

Users Table

    • user_id                       Integer
    • username                      String
    • email                         String
    • password                      String
    • color                         String
    • experience                    Integer
    • total_currency                Integer
    • gems                          Integer
    • total_leaves_earned           Integer

Saves Table

    • save_id                       Integer
    • user_id                       Integer
    • map_level                     Integer
    • current_currency              Integer
    • leaves_per_second             Integer
    • map_data                      String
    • upgrades                      String
    • last_login                    DateTime

Plants Table

    • plant_id                      Integer
    • name                          String
    • price                         Integer
    • base_return                   Integer
    • color                         String
    • stage                         Integer

Upgrades Table

    • upgrade_id                    Integer
    • name                          String
    • price                         Integer
    • description                   Integer
    • color                         String
    • page                          Integer


# Technologies Used

**Backend** Python

**Frontend** HTML / CSS / Jinja2 / JavaScript

**Database** PostgreSQL (database)
