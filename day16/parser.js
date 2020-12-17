/*
--- Day 16: Ticket Translation ---
As you're walking to yet another connecting flight, you realize that one of the legs of your re-routed trip coming up is on a high-speed train. However, the train ticket you were given is in a language you don't understand. You should probably figure out what it says before you get to the train station after the next flight.

Unfortunately, you can't actually read the words on the ticket. You can, however, read the numbers, and so you figure out the fields these tickets must have and the valid ranges for values in those fields.

You collect the rules for ticket fields, the numbers on your ticket, and the numbers on other nearby tickets for the same train service (via the airport security cameras) together into a single document you can reference (your puzzle input).

The rules for ticket fields specify a list of fields that exist somewhere on the ticket and the valid ranges of values for each field. For example, a rule like class: 1-3 or 5-7 means that one of the fields in every ticket is named class and can be any value in the ranges 1-3 or 5-7 (inclusive, such that 3 and 5 are both valid in this field, but 4 is not).

Each ticket is represented by a single line of comma-separated values. The values are the numbers on the ticket in the order they appear; every ticket has the same format. For example, consider this ticket:

.--------------------------------------------------------.
| ????: 101    ?????: 102   ??????????: 103     ???: 104 |
|                                                        |
| ??: 301  ??: 302             ???????: 303      ??????? |
| ??: 401  ??: 402           ???? ????: 403    ????????? |
'--------------------------------------------------------'
Here, ? represents text in a language you don't understand. This ticket might be represented as 101,102,103,104,301,302,303,401,402,403; of course, the actual train tickets you're looking at are much more complicated. In any case, you've extracted just the numbers in such a way that the first number is always the same specific field, the second number is always a different specific field, and so on - you just don't know what each position actually means!

Start by determining which tickets are completely invalid; these are tickets that contain values which aren't valid for any field. Ignore your ticket for now.

For example, suppose you have the following notes:

class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12
It doesn't matter which position corresponds to which field; you can identify invalid nearby tickets by considering only whether tickets contain values that are not valid for any field. In this example, the values on the first nearby ticket are all valid for at least one field. This is not true of the other three nearby tickets: the values 4, 55, and 12 are are not valid for any field. Adding together all of the invalid values produces your ticket scanning error rate: 4 + 55 + 12 = 71.

Consider the validity of the nearby tickets you scanned. What is your ticket scanning error rate?

--- Part Two ---
Now that you've identified which tickets contain invalid values, discard those tickets entirely. Use the remaining valid tickets to determine which field is which.

Using the valid ranges for each field, determine what order the fields appear on the tickets. The order is consistent between all tickets: if seat is the third field, it is the third field on every ticket, including your ticket.

For example, suppose you have the following notes:

class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9
Based on the nearby tickets in the above example, the first position must be row, the second position must be class, and the third position must be seat; you can conclude that in your ticket, class is 12, row is 11, and seat is 13.

Once you work out which field is which, look for the six fields on your ticket that start with the word departure. What do you get if you multiply those six values together?
*/

let fs = require("fs");
let text = fs.readFileSync("./input.txt");
let entriesArray = text.toString().split("\n");

function parseRuleLine(line) {
    let splitLine = line.split(': ');
    let ranges = splitLine[1].split(' ');
    let range1 = ranges[0].split('-').map(item => parseInt(item));
    let range2 = ranges[2].split('-').map(item => parseInt(item));
    return {
        id: splitLine[0],
        ranges: [range1, range2],
        matchingIndexes: {}
    }
}

function parseTicketLine(line) {
    return line.split(',').map(item => parseInt(item));
}

let index = 0;
let line = entriesArray[index];
let rules = [];
let myTicket = null;
let nearbyTickets = [];
let invalidNumbers = [];
let multiplier = 1;

while (line) {
    let parsedRule = parseRuleLine(line);
    rules.push(parsedRule);
    index ++;
    line = entriesArray[index];
}

index ++;
line = entriesArray[index];

while (line) {
    if (line !== 'your ticket:') {
        myTicket = parseTicketLine(line);
    }
    index ++;
    line = entriesArray[index];
}

index ++;
line = entriesArray[index];

while (line) {
    if (line !== 'nearby tickets:') {
        let nearbyTicket = parseTicketLine(line);
        let ticketMatches = true;
        nearbyTicket.forEach(ticketItem => {
            let ticketItemMatches = false;
            rules.forEach(rule => {
                if ((ticketItem >= rule.ranges[0][0] && ticketItem <= rule.ranges[0][1]) || (ticketItem >= rule.ranges[1][0] && ticketItem <= rule.ranges[1][1])) {
                    ticketItemMatches = true;
                }
            });

            if (!ticketItemMatches) {
                ticketMatches = false;
            }
        });

        if (ticketMatches) {
            nearbyTickets.push(parseTicketLine(line));
        }
    }
    index ++;
    line = entriesArray[index];
}

console.log('NearbyTickets: \n' + nearbyTickets.join('\n'));

for (let i = 0; i < nearbyTickets.length; i++) {
    let nearbyTicket = nearbyTickets[i];
    for (let j = 0; j < nearbyTicket.length; j++) {
        let ticketItem = nearbyTicket[j];

        rules.forEach(rule => {
            if ((ticketItem >= rule.ranges[0][0] && ticketItem <= rule.ranges[0][1]) || (ticketItem >= rule.ranges[1][0] && ticketItem <= rule.ranges[1][1])) {
                if (!rule.matchingIndexes['index' + j]) {
                    rule.matchingIndexes['index' + j] = 1;
                } else {
                    rule.matchingIndexes['index' + j] ++;
                }
            }
        });
    }
}

let ruleProbability = {};

for (let rule in rules) {
    let greatestValues = [];
    let greatestValue = 0;
    let matchingIndexes = rules[rule].matchingIndexes;
    for (let matchingIndex in matchingIndexes) {
        let indexCount = matchingIndexes[matchingIndex];
        if (indexCount > greatestValue) {
            greatestValues = [matchingIndex];
            greatestValue = indexCount;
        } else if (indexCount === greatestValue) {
            greatestValues.push(matchingIndex);
        }
    }

    ruleProbability[rules[rule].id] = greatestValues;
}

function findUniqueItemsFromArray1(arr1, arr2) { 
    let output = [];
    arr1.forEach(item => {
        if (!arr2.includes(item)) {
            output.push(item);
        }
    });

    return output;
}

let foundForAllRules = false;

while (!foundForAllRules) {
    foundForAllRules = true;
    for (let singleRuleProb in ruleProbability) {
        let allOtherRules = [];
        for (let rp in ruleProbability) {
            if (rp !== singleRuleProb) {
                allOtherRules = allOtherRules.concat(ruleProbability[rp]);
            }
        }
        console.log('allOtherRules: ' + allOtherRules);
        let uniqueResults = findUniqueItemsFromArray1(ruleProbability[singleRuleProb], allOtherRules);
        if (uniqueResults.length) {
            console.log(singleRuleProb + ': ' + uniqueResults);
            ruleProbability[singleRuleProb] = uniqueResults;
        } else {
            foundForAllRules = false;
        }
    }
}

for (let singleRuleProb in ruleProbability) {
    if (singleRuleProb.includes('departure')) {
        let ticketIndex = ruleProbability[singleRuleProb][0];
        console.log(singleRuleProb + '(' + ticketIndex + '): ' + myTicket[ticketIndex.split('index')[1]]);
        multiplier *= myTicket[ticketIndex.split('index')[1]];
    }
}



console.log('Rules: ' + JSON.stringify(rules));
console.log('Sum of errors: ' + invalidNumbers.reduce((a, b) => a + b, 0));
console.log('ruleProbability: ' + JSON.stringify(ruleProbability));
console.log('depature multiplier: ' + multiplier);
console.log('myTicket: ' + myTicket);
//console.log('nearbyTickets: ' + nearbyTickets);