/*
--- Day 7: Handy Haversacks ---
You land at the regional airport in time for your next flight. In fact, it looks like you'll even have time to grab some food: all flights are currently delayed due to issues in luggage processing.

Due to recent aviation regulations, many rules (your puzzle input) are being enforced about bags and their contents; bags must be color-coded and must contain specific quantities of other color-coded bags. Apparently, nobody responsible for these regulations considered how long they would take to enforce!

For example, consider the following rules:

light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.
These rules specify the required contents for 9 bag types. In this example, every faded blue bag is empty, every vibrant plum bag contains 11 bags (5 faded blue and 6 dotted black), and so on.

You have a shiny gold bag. If you wanted to carry it in at least one other bag, how many different bag colors would be valid for the outermost bag? (In other words: how many colors can, eventually, contain at least one shiny gold bag?)

In the above rules, the following options would be available to you:

A bright white bag, which can hold your shiny gold bag directly.
A muted yellow bag, which can hold your shiny gold bag directly, plus some other bags.
A dark orange bag, which can hold bright white and muted yellow bags, either of which could then hold your shiny gold bag.
A light red bag, which can hold bright white and muted yellow bags, either of which could then hold your shiny gold bag.
So, in this example, the number of bag colors that can eventually contain at least one shiny gold bag is 4.

How many bag colors can eventually contain at least one shiny gold bag? (The list of rules is quite long; make sure you get all of it.)

--- Part Two ---
It's getting pretty expensive to fly these days - not because of ticket prices, but because of the ridiculous number of bags you need to buy!

Consider again your shiny gold bag and the rules from the above example:

faded blue bags contain 0 other bags.
dotted black bags contain 0 other bags.
vibrant plum bags contain 11 other bags: 5 faded blue bags and 6 dotted black bags.
dark olive bags contain 7 other bags: 3 faded blue bags and 4 dotted black bags.
So, a single shiny gold bag must contain 1 dark olive bag (and the 7 bags within it) plus 2 vibrant plum bags (and the 11 bags within each of those): 1 + 1*7 + 2 + 2*11 = 32 bags!

Of course, the actual rules have a small chance of going several levels deeper than this example; be sure to count all of the bags, even if the nesting becomes topologically impractical!

Here's another example:

shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.
In this example, a single shiny gold bag must contain 126 other bags.

How many individual bags are required inside your single shiny gold bag?

*/

const { count } = require("console");
let fs = require("fs");
let text = fs.readFileSync("./input.txt");
let entriesArray = text.toString().split("\n");

let totalBagsGoldCanFitIn = new Set();

function calculateTotalBagsThatCanContain(startingBagName, bagRules) {
    if (bagRules[startingBagName]['insideOf'].length < 1) {
        return;
    } else {
        bagRules[startingBagName]['insideOf'].forEach(bagName => {
            totalBagsGoldCanFitIn.add(bagName);
            calculateTotalBagsThatCanContain(bagName, bagRules);
        });
        return;
    }
}

function calculateTotalBagsInsideProvidedBag(startingBagName, bagRules) {
    if (bagRules[startingBagName]['holds'].length < 1) {
        return 1;
    } else {
        let count = 1;
        bagRules[startingBagName]['holds'].forEach(bagData => {
            count += bagData.number * calculateTotalBagsInsideProvidedBag(bagData.name, bagRules);
        });
        return count;
    }
}


function parseLine(entryLine, bagRules) {
    let mainBagName = entryLine.substring(0, entryLine.indexOf(' contain'));
    if (mainBagName[mainBagName.length - 1] === 's') {
        mainBagName = mainBagName.substring(0, mainBagName.length - 1);
    }
    let bagsToHoldArray = entryLine.substring(entryLine.indexOf(' contain') + 8).split(',');

    if (!bagRules[mainBagName]) {
        bagRules[mainBagName] = {
            holds: [],
            insideOf: []
        }
    }

    bagsToHoldArray.forEach(bagToHold => {
        if (!bagToHold.includes('no')) {
            let normalizedBagToHold = bagToHold.trim().replace('.','');
            if (normalizedBagToHold[normalizedBagToHold.length - 1] === 's') {
                normalizedBagToHold = normalizedBagToHold.substring(0, normalizedBagToHold.length - 1);
            }
            let numberToHold = parseInt(normalizedBagToHold.substring(0, normalizedBagToHold.indexOf(' ')));
            let nameOfBag = normalizedBagToHold.substring(normalizedBagToHold.indexOf(' ') + 1);

            if (!bagRules[nameOfBag]) {
                bagRules[nameOfBag] = {
                    holds: [],
                    insideOf: [mainBagName]
                }
            } else {
                bagRules[nameOfBag].insideOf.push(mainBagName);
            }
            
            bagRules[mainBagName].holds.push({name: nameOfBag, number: numberToHold});
        }
    });
}

let bagRules = {};

for (let i = 0; i < entriesArray.length; i++) {
    parseLine(entriesArray[i], bagRules);
}

calculateTotalBagsThatCanContain('shiny gold bag', bagRules);
let numberOfBagsThatAreContainedInGold = calculateTotalBagsInsideProvidedBag('shiny gold bag', bagRules) - 1; // minus one to exclude the gold bag

//console.log('Bag rules: ' + JSON.stringify(bagRules));
console.log('Number of bags that can contain shiny gold bag: ' + totalBagsGoldCanFitIn.size);
console.log('Number of bags that are required to fit inside a shiny gold bag: ' + numberOfBagsThatAreContainedInGold);

