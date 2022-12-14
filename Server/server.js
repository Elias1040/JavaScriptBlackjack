const http = require('http');

const hostname = '192.168.137.1';
const port = 80;
const ws = new require("ws")
const wss = new ws.Server({ noServer: true })

const server = http.createServer((req, res) => {
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


var deck = []
var dealerHand = []
var endGame = false;

const suits = { 0: "Spades", 1: "Hearts", 2: "Clubs", 3: "Diamonds" }


class Card {
    constructor(suit, value, imgValue) {
        this.suit = suits[suit]
        this.value = value
        this.imageSrc = `/Pics/Cards/${imgValue}&${suit}.png`
    }
}

class User {
    constructor(id, socket) {
        this.id = id
        this.socket = socket
        this.stand = false
        this.lost = false
        this.cards = []
    }
}

const clients = []

function onSocketConnect(ws) {
    clients.push(new User(clients.length, ws, []))
    ws.on('message', message => {
        let action = message.toString().split(',')
        if (!endGame || action[0] == "startGame" || action[0] == "restart") {
            switch (action[0]) {
                case "hit":
                    Hit(action)
                    break;
                case "stand":
                    Stand(action)
                    break;
                case "startGame":
                    if (clients.length == 2) {
                        Clear(clients)
                        start()
                        startGame()
                        CheckLost(clients)
                    }
                    else if (clients.length == 1){
                        clients[0].socket.send("redirect")
                    }
                    else if (clients.length > 2)
                        clients[clients.length - 1].socket.send("redirect")
                    break;
                case "restart":
                    clients.forEach(x => x.socket.send("restartGame"), this)
                    break;
            }
        }
    })
    ws.on('close', () => {
        clients.splice(clients.indexOf(x => x.socket == ws), 1)
        console.log(clients.length)
    })
    ws.on('error', error => console.log(error.message))
}

// Draws a card for the player and sends the card to all players and checks the result
function Hit(action) {
    let client = clients.find(x => x.id == action[1])
    let otherClient = clients.find(x => x.id != action[1])
    if (!client.stand && !client.lost) {
        client.socket.send(`returnhit,${DrawCard(client).imageSrc},${AddPoints(client.cards)}`)
        otherClient.socket.send(`othercards,${client.cards[client.cards.length - 1].imageSrc},${AddPoints(client.cards)}`)
        CheckResults(client)
    }
    CheckLost(clients)
    CheckStands(clients)
}

// Change stand to true and send it back and check stands
function Stand(action) {
    let client = clients.find(x => x.id == action[1])
    if (!client.stand && !client.lost) {
        client.stand = true
        client.socket.send("stand")
        CheckStands(clients)
    }
}

// Starts the game and gives all players and the dealer cards and sends them to all players
function startGame() {
    dealerHand = [deck.pop(), deck.pop()]
    clients.forEach(x => {
        x.socket.send(`onstartgame,${x.id},${DrawCard(x).imageSrc},${DrawCard(x).imageSrc},${AddPoints(x.cards)}`)
        x.socket.send(`dealerCards,${dealerHand[0].imageSrc},${dealerHand[0].value}`)
        x.socket.send(`dealerCards,/Pics/Cards/back.png,${dealerHand[0].value}`)
        CheckResults(x)
    }, this)
    clients.forEach(x => {
        clients.forEach(y => {
            if (x.id != y.id) {
                y.cards.forEach(z => {
                    x.socket.send(`othercards,${z.imageSrc},${AddPoints(y.cards)}`)
                }, this)
            }
        }, this)
    }, this)
}

// Checks if all players are standing
function CheckStands(players) {
    if (players.every(x => x.stand)) {
        players.forEach(x => x.socket.send(`revealcard,${dealerHand[1].imageSrc},${AddPoints(dealerHand)}`), this)
        if (!players.every(x => x.lost)) {
            DrawDealerCards(players)
        }
        CheckEndResults(players)
    }
}

// Clear all players cards, dealers cards and sets endgame to false
function Clear(players) {
    players.forEach(x => {
        x.cards = []
        x.stand = false
        x.lost = false
    }, this)
    dealerHand = []
    endGame = false
}

// Creates the deck
function start() {
    deck = function () {
        let arr = [];
        for (let suit = 0; suit < 4; suit++) {
            for (let card = 1; card < 14; card++) {
                arr.push(new Card(suit, (card <= 10 ? card : 10), card))
            }
        }
        return arr;
    }();
    Shuffle();
}

// Shuffle the deck
function Shuffle() {
    for (let i = 0; i < Math.floor((Math.random() * 52) + 10); i++) {
        let deckCopy = deck.slice();
        let index = []
        deckCopy.forEach(x => index.push(deckCopy.indexOf(x)))
        deck.forEach(x => deckCopy[index.splice(Math.floor(Math.random() * index.length), 1)[0]] = x)
        deck = deckCopy.slice()
    }
}

// Push a card into the players hand
function DrawCard(user) {
    if (!user.stand) {
        user.cards.push(deck.pop())
        return user.cards[user.cards.length - 1]
    }
}

// Push cards into dealers hand
function DrawDealerCards(players) {
    while (AddPoints(dealerHand) < 17 && players.every(x => AddPoints(x.cards) > AddPoints(dealerHand), this)) {
        dealerHand.push(deck.pop())
        players.forEach(x => x.socket.send(`dealerCards,${dealerHand[dealerHand.length - 1].imageSrc},${AddPoints(dealerHand)}`), this)
    }
}

// Check if all players lost
function CheckLost(players) {
    if (clients.every(x => x.lost, this)) {
        CheckEndResults(clients)
    }
}

// Checks results after hit
function CheckResults(player) {
    if (AddPoints(player.cards) > 21) {
        player.lost = true
        player.stand = true
        player.socket.send("endresult,You Lost!")
    }
}

// Checks results when all players stand
function CheckEndResults(players) {
    players.forEach(x => {
        if (!x.lost) {
            if ((AddPoints(x.cards) <= 21 && AddPoints(dealerHand) > 21) || AddPoints(x.cards) > AddPoints(dealerHand)) {
                x.socket.send("endresult,You Won!")
            }
            else if (AddPoints(x.cards) == AddPoints(dealerHand)) {
                x.socket.send("endresult,Tie!")
            }
            else {
                x.socket.send("endresult,You Lost!")
            }
        }
    }, this)
    endGame = true;
}

// Adds all card points
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