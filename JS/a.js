const { readdirSync, rename } = require('fs');
const { resolve } = require('path');

// Get path to image directory
const imageDirPath = resolve("C:/Users/elias/OneDrive/Skrivebord/JavaScriptBlackjack/Pics/Cards");

// Get an array of the files inside the folder

for (let i = 1; i < 52; i++){
    if(i / 13 <= 1){
        rename(imageDirPath + `/${i}.png`, imageDirPath + `/${i}&0.png`, err => console.log(err))
    }
    else if (i / 13 <= 2) {
        rename(imageDirPath + `/${i}.png`, imageDirPath + `/${i%13}&1.png`, err => console.log(err))
    }
    else if (i / 13 <= 3) {
        rename(imageDirPath + `/${i}.png`, imageDirPath + `/${i%13}&2.png`, err => console.log(err))
    }
    else if (i / 13 <= 4) {
        rename(imageDirPath + `/${i}.png`, imageDirPath + `/${i%13}&3.png`, err => console.log(err))
    }
}