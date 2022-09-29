const http = require('http');

const hostname = '192.168.1.18';
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
var allUsersStand = false

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
        if (!endGame) {
            let action = message.toString().split(',')
            switch (action[0]) {
                case "hit":
                    {
                        let client = clients.find(x => x.id == action[1])
                        if (!client.stand && !client.lost) {
                            client.socket.send(`returnhit,${DrawCard(client).imageSrc}`)
                            CheckResults(client)
                        }
                        CheckLost(clients)
                        CheckStands(clients)
                    }
                    break;
                case "stand":
                    {
                        let client = clients.find(x => x.id == action[1])
                        if (!client.stand && !client.lost) {
                            client.stand = true
                            CheckStands(clients)
                        }
                    }
                    break;
                case "startGame":
                    start()
                    dealerHand = [deck.pop(), deck.pop()]
                    clients.forEach(x => {
                        x.socket.send(`onstartgame,${x.id},${DrawCard(x).imageSrc},${DrawCard(x).imageSrc}`)
                        x.socket.send(`dealerCards,${dealerHand[0].imageSrc}`)
                        x.socket.send(`dealerCards,${dealerHand[1].imageSrc}`)
                        CheckResults(x)
                    }, this)
                    CheckLost(clients)
                    break;
            }
        }
    })
    // ws.on('close', () => clients.delete(ws))
}



function CheckStands(players) {
    if (players.every(x => x.stand)) {
        DrawDealerCards(players)
        CheckEndResults(players)
    }
}


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

function Shuffle() {
    for (let i = 0; i < Math.floor((Math.random() * 52) + 10); i++) {
        let deckCopy = deck.slice();
        let index = []
        deckCopy.forEach(x => index.push(deckCopy.indexOf(x)))
        deck.forEach(x => deckCopy[index.splice(Math.floor(Math.random() * index.length), 1)[0]] = x)
        deck = deckCopy.slice()
    }
}

function DrawCard(user) {
    if (!user.stand) {
        user.cards.push(deck.pop())
        return user.cards[user.cards.length - 1]
    }
}

function DrawDealerCards(players) {
    while (AddPoints(dealerHand) < 17 && players.every(x => AddPoints(x.cards) > AddPoints(dealerHand), this)) {
        dealerHand.push(deck.pop())
        players.forEach(x => x.socket.send(`dealerCards,${dealerHand[dealerHand.length - 1].imageSrc}`), this)
    }
}

function CheckLost(players) {
    if (clients.every(x => x.lost, this)) {
        CheckEndResults(clients)
    }
}

function CheckResults(player) {
    if (AddPoints(player.cards) > 21) {
        player.lost = true
        player.stand = true
        player.socket.send("endresult,You Lost!")
    }
}

function CheckEndResults(players) {
    players.forEach(x => {
        if (!x.lost) {
            if ((AddPoints(x.cards) <= 21 && AddPoints(dealerHand) > 21)|| AddPoints(x.cards) > AddPoints(dealerHand)) {
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