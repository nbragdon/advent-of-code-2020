/*

--- Day 13: Shuttle Search ---
Your ferry can make it safely to a nearby port, but it won't get much further. When you call to book another ship, you discover that no ships embark from that port to your vacation island. You'll need to get from the port to the nearest airport.

Fortunately, a shuttle bus service is available to bring you from the sea port to the airport! Each bus has an ID number that also indicates how often the bus leaves for the airport.

Bus schedules are defined based on a timestamp that measures the number of minutes since some fixed reference point in the past. At timestamp 0, every bus simultaneously departed from the sea port. After that, each bus travels to the airport, then various other locations, and finally returns to the sea port to repeat its journey forever.

The time this loop takes a particular bus is also its ID number: the bus with ID 5 departs from the sea port at timestamps 0, 5, 10, 15, and so on. The bus with ID 11 departs at 0, 11, 22, 33, and so on. If you are there when the bus departs, you can ride that bus to the airport!

Your notes (your puzzle input) consist of two lines. The first line is your estimate of the earliest timestamp you could depart on a bus. The second line lists the bus IDs that are in service according to the shuttle company; entries that show x must be out of service, so you decide to ignore them.

To save time once you arrive, your goal is to figure out the earliest bus you can take to the airport. (There will be exactly one such bus.)

For example, suppose you have the following notes:

939
7,13,x,x,59,x,31,19
Here, the earliest timestamp you could depart is 939, and the bus IDs in service are 7, 13, 59, 31, and 19. Near timestamp 939, these bus IDs depart at the times marked D:

time   bus 7   bus 13  bus 59  bus 31  bus 19
929      .       .       .       .       .
930      .       .       .       D       .
931      D       .       .       .       D
932      .       .       .       .       .
933      .       .       .       .       .
934      .       .       .       .       .
935      .       .       .       .       .
936      .       D       .       .       .
937      .       .       .       .       .
938      D       .       .       .       .
939      .       .       .       .       .
940      .       .       .       .       .
941      .       .       .       .       .
942      .       .       .       .       .
943      .       .       .       .       .
944      .       .       D       .       .
945      D       .       .       .       .
946      .       .       .       .       .
947      .       .       .       .       .
948      .       .       .       .       .
949      .       D       .       .       .
The earliest bus you could take is bus ID 59. It doesn't depart until timestamp 944, so you would need to wait 944 - 939 = 5 minutes before it departs. Multiplying the bus ID by the number of minutes you'd need to wait gives 295.

What is the ID of the earliest bus you can take to the airport multiplied by the number of minutes you'll need to wait for that bus?

--- Part Two ---
The shuttle company is running a contest: one gold coin for anyone that can find the earliest timestamp such that the first bus ID departs at that time and each subsequent listed bus ID departs at that subsequent minute. (The first line in your input is no longer relevant.)

For example, suppose you have the same list of bus IDs as above:

7,13,x,x,59,x,31,19
An x in the schedule means there are no constraints on what bus IDs must depart at that time.

This means you are looking for the earliest timestamp (called t) such that:

Bus ID 7 departs at timestamp t.
Bus ID 13 departs one minute after timestamp t.
There are no requirements or restrictions on departures at two or three minutes after timestamp t.
Bus ID 59 departs four minutes after timestamp t.
There are no requirements or restrictions on departures at five minutes after timestamp t.
Bus ID 31 departs six minutes after timestamp t.
Bus ID 19 departs seven minutes after timestamp t.
The only bus departures that matter are the listed bus IDs at their specific offsets from t. Those bus IDs can depart at other times, and other bus IDs can depart at those times. For example, in the list above, because bus ID 19 must depart seven minutes after the timestamp at which bus ID 7 departs, bus ID 7 will always also be departing with bus ID 19 at seven minutes after timestamp t.

In this example, the earliest timestamp at which this occurs is 1068781:

time     bus 7   bus 13  bus 59  bus 31  bus 19
1068773    .       .       .       .       .
1068774    D       .       .       .       .
1068775    .       .       .       .       .
1068776    .       .       .       .       .
1068777    .       .       .       .       .
1068778    .       .       .       .       .
1068779    .       .       .       .       .
1068780    .       .       .       .       .
1068781    D       .       .       .       .
1068782    .       D       .       .       .
1068783    .       .       .       .       .
1068784    .       .       .       .       .
1068785    .       .       D       .       .
1068786    .       .       .       .       .
1068787    .       .       .       D       .
1068788    D       .       .       .       D
1068789    .       .       .       .       .
1068790    .       .       .       .       .
1068791    .       .       .       .       .
1068792    .       .       .       .       .
1068793    .       .       .       .       .
1068794    .       .       .       .       .
1068795    D       D       .       .       .
1068796    .       .       .       .       .
1068797    .       .       .       .       .
In the above example, bus ID 7 departs at timestamp 1068788 (seven minutes after t). This is fine; the only requirement on that minute is that bus ID 19 departs then, and it does.

Here are some other examples:

The earliest timestamp that matches the list 17,x,13,19 is 3417.
67,7,59,61 first occurs at timestamp 754018.
67,x,7,59,61 first occurs at timestamp 779210.
67,7,x,59,61 first occurs at timestamp 1261476.
1789,37,47,1889 first occurs at timestamp 1202161486.
However, with so many bus IDs in your list, surely the actual earliest timestamp will be larger than 100000000000000!

What is the earliest timestamp such that all of the listed bus IDs depart at offsets matching their positions in the list?

*/

let fs = require("fs");
let text = fs.readFileSync("./input.txt");
let entriesArray = text.toString().split("\n")

function parseLine(entryLine) {
    let lineItems = entryLine.split(" ");
    let rangeItems = lineItems[0].split("-");
    let minOccurences = parseInt(rangeItems[0]);
    let maxOccurences = parseInt(rangeItems[1]);
    let letterToMatch = lineItems[1][0];
    let passwordToCheck = lineItems[2];

    let numberOfOccurences = passwordToCheck.split(letterToMatch).length - 1;
    if (numberOfOccurences >= minOccurences && numberOfOccurences <= maxOccurences) { 
        return true;
    }
    return false;
}

function parseLinePart2(entryLine) {
    let lineItems = entryLine.split(" ");
    let rangeItems = lineItems[0].split("-");
    let firstOccurrence = parseInt(rangeItems[0]) - 1;
    let secondOccurrence = parseInt(rangeItems[1]) - 1;
    let letterToMatch = lineItems[1][0];
    let passwordToCheck = lineItems[2];

    let matchesFirstPosition = passwordToCheck[firstOccurrence] === letterToMatch && passwordToCheck[secondOccurrence] != letterToMatch;
    let matchesSecondPosition = passwordToCheck[secondOccurrence] === letterToMatch && passwordToCheck[firstOccurrence] != letterToMatch;
    if (matchesFirstPosition || matchesSecondPosition) { 
        return true;
    }

    return false;
}

let earliestBusDepatureTime = parseInt(entriesArray[0]);
let potentialBusEntries = entriesArray[1].split(',');
let finalBusEntries = [];
let busEntries2 = [];
let currentTimeIncrement = 0;

potentialBusEntries.forEach(busEntry => {
    let busTime = parseInt(busEntry);

    if (busTime) {
        finalBusEntries.push(busTime);
        busEntries2.push({
            id: busTime,
            timeIncrement: currentTimeIncrement
        });
    }

    currentTimeIncrement++;
});

busEntries2.sort((a, b) => a.id - b.id);
let baseT = 0;
let increment = 1;
let loopCount = 0;

busEntries2.forEach(busEntry => {
    let adjustedReferenceTime = baseT + busEntry.timeIncrement;
    let remainder = adjustedReferenceTime % busEntry.id;
    while (remainder !== 0) {
        baseT += increment;
        adjustedReferenceTime = baseT + busEntry.timeIncrement;
        remainder = adjustedReferenceTime % busEntry.id;
        loopCount++;
    }

    increment *= busEntry.id;
});

/*
Part 1 stuff
let x = 1;
let busIdToTake = null;

while (!busIdToTake || x === 5000) {
    let timeDifference = {
        id: null,
        difference: null
    };
    finalBusEntries.forEach(busEntry => {
        let busArrivalTime = busEntry * x;
        let currentDifference = busArrivalTime - earliestBusDepatureTime;
        if (currentDifference >= 0) {
            if (!timeDifference.id || currentDifference < timeDifference.difference) {
                timeDifference.id = busEntry;
                timeDifference.difference = busArrivalTime - earliestBusDepatureTime;
            }
        }
    });

    if (timeDifference.id) {
        busIdToTake = timeDifference;
    }

    x++;
}
*/





console.log("Bus entries: " + JSON.stringify(busEntries2));
console.log("Lowest Matching ID: " + baseT);
console.log('Iterations to find: ' + loopCount);

