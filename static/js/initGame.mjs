import { Game } from './game.mjs'


let x = 0;
let y = 0;

let gameSquares = document.getElementsByClassName('game-square');
let shopItems = document.getElementsByClassName('shop-item');


// get map data from db and feed into newgame Game() constructor
fetch('/mygame').then(response => response.json())
    .then(data => {
        //process the response data
        console.log(data)
    }).catch(err => {
        // handle any errors
        console.error('Error:', err)
    });

const newGame = new Game();
console.log('\n\n\n\n\n\n\n\nthese are my base plants:')
console.log(base_plants)
// shop buttons event listeners
for (let j = 0; j < shopItems.length; j++) {
    shopItems[j].addEventListener('click', e => newGame.updateUserSelection(e))
}

// game square event listeners
for (let sq = 0; sq < gameSquares.length; sq++) {
    gameSquares[sq].addEventListener('click', e => newGame.userClickGameSquare(e))
    gameSquares[sq].addEventListener('mouseenter', e => newGame.userHoverGameSquare(e))
}