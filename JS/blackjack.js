// var requirejs = require("../node_modules/requirejs//bin/r.js")
// requirejs.config({
//     //Pass the top-level main.js/index.js require
//     //function to requirejs so that node modules
//     //are loaded relative to the top-level JS file.
//     nodeRequire: require
// });

const {rando, randoSequence} = SetRequire()

function SetRequire(){
    if (typeof process === 'object'){
        return require('@nastyox/rando.js')
    }
    else{
        return null
    }
}

class Card {
    constructor(suit, value){
        this.suit = suits[suit]
        this.value = value
    }
}




// var deck = [cards, cards, cards, cards];
// var userCards = [deck[rando(0, 3)].splice(rando(0, 12), 1)[0]];
// var dealerCards = [deck[rando(0, 3)].splice(rando(0, 12), 1)[0]];


const suits = { 0: "Hearts", 1: "Diamonds", 2: "Spades", 3: "Clubs"}
var deck = []
for (let suit = 0; suit < suits.length; suit++) {
    for (let card = 1; card < 13; card++)
    {
        deck.push(new Card(suit, (card == 0 ? 0 : (card <= 10 ? card : 10))))
    }
}

let shuffles = Math.floor(Math.random() * 10)
for (let i = 0; i < shuffles; i++){
    Shuffle()
}

function Shuffle(){
    let deckCopy = deck;
    let index = []
    deckCopy.forEach(x => index.push(deckCopy.indexOf(x)))
    deck.forEach(x => deckCopy[index.splice(Math.floor(Math.random() * index.length), 1)[0]] = x)
    deck = deckCopy
}

var userStand = false;
var dealerStand = false;
var usersTurn = true;
var endGame = false;
var userCards = []
var dealerCards = []


function StartGame(){
    document.getElementById("startBtn").hidden = true;
    endGame = false
    while (-endGame){
        DrawCard()
    }
}

while (!endGame){
    DrawCard()
}


function DrawCard(){
    if (usersTurn) {
        // userCards.push(deck.pop())
        userCards.push(new Card(0, [1, 11]))
        CheckPoints()
        usersTurn = false
        }
    else {
        dealerCards.push(deck.pop())
        CheckPoints()
        usersTurn = true
    }
}

function AddPoints(cards) {
    let points = []
    cards.forEach((x) => {
        if (!Array.isArray(x.value)){
            points.push(x.value)
        }
        else{
            points.push(x.value[1])
        }
    }, this)

    let aceCards = cards.filter(x => Array.isArray(x.value), this)
    
    if (points.reduce((x, y) => x + y) > 21 && aceCards.length > 0) {
        aceCards.forEach(x => {
            if (points.reduce((x, y) => x + y) > 21){
                points.find(x => x === 11) = x.value[0]
            }
        });
    }

    return points 
}

function CheckPoints(){
    let userPointSum = AddPoints(userCards)
    let dealerPointSum = AddPoints(dealerCards)

    if (userPointSum > 21 || dealerPointSum == 21 || (dealerPointSum < 21 && dealerPointSum > userPointSum && userStand)) {
        console.log("you lost")
        endGame = true
    }
    else if (userPointSum == 21 || dealerPointSum > 21 || (userPointSum > dealerPointSum && dealerStand)) {
        console.log("you won")
        endGame = true
    }
}