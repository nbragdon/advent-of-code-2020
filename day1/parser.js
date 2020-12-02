let fs = require("fs");
let text = fs.readFileSync("./aoc1.txt");
let entriesArray = text.toString().split("\n")

for (let i = 0; i < entriesArray.length; i++) {
    for (let j = i + 1; j < entriesArray.length; j++) {
        for (let k = j + 1; k < entriesArray.length; k++) {
            let baseNumber = parseInt(entriesArray[i]);
            let checkingNumber = parseInt(entriesArray[j]);
            let checkingNumber2 = parseInt(entriesArray[k]);
            if (baseNumber + checkingNumber + checkingNumber2 == 2020) {
                console.log("Base number: " + baseNumber);
                console.log("Checking number: " + checkingNumber);
                console.log("Checking number: " + checkingNumber2);
                console.log(baseNumber * checkingNumber * checkingNumber2);
            }
        }
    }
}