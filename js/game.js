
select

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