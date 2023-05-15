class gameSquare {
    constructor() {
        this.char = '.';
        this.color = '#ffffff';
        this.plant_id = undefined;
    }
}

class plant {
    constructor(name, char, color) {
        this.name = name;
        this.char = char;
        this.color = color;
    }
}

class Game {
    constructor(save_id, user_id, current_currency) {
        this.id = save_id
        this.user_id = user_id
        this.current_currency = current_currency
        this.leaves_per_second = leaves_per_second
        this.upgrades = upgrades
        this.purchases = purchases
        this.last_login = last_login
    }
}