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
for (let j = 0; j < shopItems.length; j++) {
    shopItems[j].addEventListener('click', e => newGame.updateUserSelection(e))
    console.log(shopItems[j])
}

