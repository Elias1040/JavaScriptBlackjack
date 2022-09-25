// const {rando, randoSequence} = require('@nastyox/rando.js')

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

var deck;


var userCards;
var dealerCards;

// while (!endGame){
    //     DrawCard()
    // }
    
    
    
function StartGame() {
    deck = function () {
        let arr = [];
        for (let suit = 0; suit < 4; suit++) {
            for (let card = 1; card < 13; card++) {
                arr.push(new Card(suit, (card <= 10 ? card : 10), card))
            }
        }
        return arr;
    }();
    Shuffle();
    document.getElementById("startBtn").hidden = true;
    userCards = [deck.pop(), deck.pop()]
    dealerCards = [deck.pop(), deck.pop()]
    userCards.forEach((x, y) => setTimeout(() => UserCardHtml(x), 225 * (y + 1)));
    dealerCards.forEach((x, y) => setTimeout(() => DealerCardHtml(x), 225 * (y + 3)));
    endGame = false;
    CheckPoints();
    document.getElementById("UserPoints").parentElement.hidden = false
    document.getElementById("DealerPoints").parentElement.hidden = false
    document.getElementById("Hit").hidden = false;
    document.getElementById("Stand").hidden = false;
}

function RestartGame() {
    while (document.getElementById("UserSide").hasChildNodes()){
        document.getElementById("UserSide").removeChild(document.getElementById("UserSide").firstChild)
    }
    while (document.getElementById("DealerSide").hasChildNodes()){
        document.getElementById("DealerSide").removeChild(document.getElementById("DealerSide").firstChild)
    }
    userCards = []
    dealerCards = []
    userStand = false
    document.getElementById("Result").parentElement.parentElement.className = "d-none"
    document.getElementById("canvas").className = "col-12 h-100"
    StartGame();
}

function UserCardHtml(card) {
    let htmlCard = document.createElement("img");
    htmlCard.className = "border border-black border-2 ms-2 me-2 slide-in-right";
    htmlCard.src = card.imageSrc;
    htmlCard.height = 225;
    htmlCard.width = 150;
    htmlCard.id = `${card.value}&${card.suit}`
    document.getElementById("UserSide").appendChild(htmlCard);
}

function DealerCardHtml(card) {
    let htmlCard = document.createElement("img");
    htmlCard.className = "border border-black border-2 ms-2 me-2 slide-in-right";
    htmlCard.src = card.imageSrc;
    htmlCard.height = 225;
    htmlCard.width = 150;
    document.getElementById("DealerSide").appendChild(htmlCard);
}

function ResultHtml(result) {
    document.getElementById("Result").innerText = result;
    document.getElementById("Hit").hidden = true;
    document.getElementById("Stand").hidden = true;
    document.getElementById("Result").parentElement.parentElement.className = "col-12 h-50 d-flex justify-content-center position-absolute top-50 start-50 translate-middle"
    document.getElementById("canvas").className = "col-12 h-100 blur"
    document.getElementById("Result").parentElement.className = "col-4 border border-2 border bg-white text-center fade-in-top"
}

function Shuffle() {
    for (let i = 0; i < Math.floor(Math.random() * 52); i++) {
        let deckCopy = deck.slice();
        let index = []
        deckCopy.forEach(x => index.push(deckCopy.indexOf(x)))
        deck.forEach(x => deckCopy[index.splice(Math.floor(Math.random() * index.length), 1)[0]] = x)
        deck = deckCopy.slice()
    }
}

function UserHit() {
    DrawCard()
}

function UserStand() {
    userStand = true;
    while (!endGame) {
        CheckPoints();
        DrawCard();
    }
}

function DrawCard() {    if (!endGame) {
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

    if (userPointSum > 21 || dealerPointSum == 21 || ((dealerPointSum <= 21 && dealerPointSum > userPointSum) && userStand)) {
        console.log("you lost")
        ResultHtml("You lost!")
        endGame = true
    }
    else if (userPointSum == 21 || (dealerPointSum > 21 && userPointSum <= 21)) {
        console.log("you won")
        ResultHtml("You won!")
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

