// var requirejs = require("../node_modules/requirejs//bin/r.js")
// requirejs.config({
//     //Pass the top-level main.js/index.js require
//     //function to requirejs so that node modules
//     //are loaded relative to the top-level JS file.
//     nodeRequire: require
// });
// const {rando, randoSequence} = require('@nastyox/rando.js');

var cards = [1,2,3,4,5,6,7,8,9,10,10,10,10]
var cardGroups = [cards, cards, cards, cards];
var userCards = [cardGroups[rando(0, 3)].splice(rando(0, 12), 1)[0]];
var dealerCards = [cardGroups[rando(0, 3)].splice(rando(0, 12), 1)[0]];

for (let i = 0; i < cardGroups.length; i++) {
    for (let j = 0; j < cards.length; j++) {
        console.log(cardGroups[i][j])
    }
}

var userStand = false;
var dealerStand = false;
var usersTurn = true;
var endGame = false;

function StartGame(){
    document.getElementById("startBtn").hidden = true;
    endGame = false
    while (!endGame){
        DrawCard()
    }
}

while (!endGame){
    DrawCard()
}


function DrawCard(){
    let randomGroup = rando(0, 3)
    let randomCard = rando(0, cardGroups[randomGroup].length - 1)
    let card = cardGroups[randomGroup].splice(randomCard, 1)[0]
    if (usersTurn) {
        userCards.push(card)
        CheckPoints()
        usersTurn = false
        }
    else {
        dealerCards.push(card)
        CheckPoints()
        usersTurn = true
    }
}

function CheckPoints(){
    let userPointSum = userCards.reduce((a,b) => a + b, 0)
    let dealerPointSum = dealerCards.reduce((a,b) => a + b, 0)
    console.log("User: " + userPointSum)
    console.log("Dealer: " + dealerPointSum)


    if (userPointSum > 21 || dealerPointSum == 21 || (dealerPointSum < 21 && dealerPointSum > userPointSum && userStand)) {
        console.log("you lost")
        endGame = true
    }
    else if (userPointSum == 21 || dealerPointSum > 21 || (userPointSum > dealerPointSum && dealerStand)) {
        console.log("you won")
        endGame = true
    }
}