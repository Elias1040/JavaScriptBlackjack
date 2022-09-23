// const {rando, randoSequence} = require('@nastyox/rando.js')


var usersTurn = true;
var userStand = false;
var endGame = false;

const suits = { 0: "Spades", 1: "Hearts", 2: "Clubs", 3: "Diamonds" }

class Card {
    constructor(suit, value, imgValue) {
        this.suit = suits[suit]
        this.value = value
        this.imageSrc = `/Pics/Cards/${imgValue}&${suit}.png`
    }
}

var deck = function() {
    let arr = [];
    for (let suit = 0; suit < 4; suit++) {
        for (let card = 1; card < 13; card++) {
            arr.push(new Card(suit, (card <= 10 ? card : 10), card))
        }
    }
    return arr;
}();

Shuffle();

var userCards = [deck.pop(), deck.pop()];
var dealerCards = [deck.pop(), deck.pop()];

// while (!endGame){
//     DrawCard()
// }

function StartGame() {
    document.getElementById("startBtn").hidden = true;
    userCards.forEach(x => UserCardHtml(x));
    dealerCards.forEach(x => DealerCardHtml(x));
    CheckPoints();
    endGame = false;
    document.getElementById("Hit").hidden = false;
    document.getElementById("Stand").hidden = false;
}

function UserCardHtml(card) {
    let htmlCard = document.createElement("img");
    htmlCard.className = "border border-black border-2";
    htmlCard.src = card.imageSrc;
    document.getElementById("UserSide").appendChild(htmlCard);
}

function DealerCardHtml(card) {
    let htmlCard = document.createElement("img");
    htmlCard.className = "border border-black border-2";
    htmlCard.src = card.imageSrc;
    document.getElementById("DealerSide").appendChild(htmlCard);
}

var ResultHtml = (result) => document.getElementById("Result").innerText = result;

function Shuffle() {
    for (let i = 0; i < Math.floor(Math.random() * 10); i++) {
        let deckCopy = deck.slice();
        let index = []
        deckCopy.forEach(x => index.push(deckCopy.indexOf(x)))
        deck.forEach(x => deckCopy[index.splice(Math.floor(Math.random() * index.length), 1)[0]] = x)
        deck = deckCopy
    }
}

function UserHit() {
    DrawCard()
}

function UserStand() {
    userStand = true;
    while (!endGame) {
        DrawCard()
    }
}

function DrawCard() {
    if (!endGame) {
        if (!userStand) {
            userCards.push(deck.pop())
            UserCardHtml(userCards[userCards.length - 1])
            CheckPoints()
        }
        else {
            dealerCards.push(deck.pop())
            DealerCardHtml(dealerCards[dealerCards.length - 1])
            CheckPoints()
        }
    }
}

function CheckPoints() {
    let userPointSum = AddPoints(userCards)
    let dealerPointSum = AddPoints(dealerCards)

    UserPointsHtml(userPointSum)
    DealerPointsHtml(dealerPointSum)

    if (userPointSum > 21 || dealerPointSum == 21 || (dealerPointSum < 21 && dealerPointSum > userPointSum && userStand)) {
        console.log("you lost")
        ResultHtml("You lose!")
        endGame = true
    }
    else if (userPointSum == 21 || (dealerPointSum > 21 && userPointSum <= 21)) {
        console.log("you won")
        ResultHtml("You win!")
        endGame = true
    }
}

function UserPointsHtml(points) {
    document.getElementById("UserPoints").innerText = points
}

function DealerPointsHtml(points) {
    document.getElementById("DealerPoints").innerText = points
}

function AddPoints(cards) {
    let points = 0
    cards.forEach(x => {
        points += x.value
    }, this)
    cards.forEach(x => {
        if (x.value == 1 && points <= 11) {
            points += 10
        }
    })
    return points
}

