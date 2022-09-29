const http = require('http');

const hostname = '192.168.1.18';
const port = 80;
const ws = new require("ws")
const wss = new ws.Server({ noServer : true })

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
        this.cards = []
    }
}

const clients = []

function onSocketConnect(ws) {
    clients.push(new User(clients.length, ws, []))
    ws.on('message', message => {
        let action = message.toString().split(',')
        switch (action[0]) {
            case "hit":
                let client = clients.find(x => x.id == action[1])
                if (!client.stand) {
                    client.socket.send(`returnhit,${DrawCard(client).imageSrc}`)
                }
                break;
            case "stand":
                clients.find(x => x.id == action[1]).stand = true
                break;
            case "startGame":
                start()
                clients.forEach(x => {
                    x.cards.push(deck.pop())
                    x.cards.push(deck.pop())
                    x.socket.send(`onstartgame,${x.id},${DrawCard(x).imageSrc},${DrawCard(x).imageSrc}`)
                }, this)
        }
    })
    // ws.on('close', () => clients.delete(ws))
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

function DrawDealerCards(){
    dealerHand.push(deck.pop())
    return dealerHand[dealerHand.length - 1]
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