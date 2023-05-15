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

    • user_id
    • username
    • email
    • password

Saves Table

    • save_id
    • user_id (references users table)
    • map_level (1 - 10, user progress)
    • current_currency
    • leaves_per_second
    • upgrades (serialized Array)
    • purchases (serialized Array)
    • last_login

Plants Table

    • plant_id
    • name
    • price
    • base_return

# Technologies Used

**Backend** Python

**Frontend** HTML / CSS / Jinja2 / JavaScript

**Database** PostgreSQL (database)
