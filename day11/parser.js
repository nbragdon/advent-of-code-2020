/*
--- Day 11: Seating System ---
Your plane lands with plenty of time to spare. The final leg of your journey is a ferry that goes directly to the tropical island where you can finally start your vacation. As you reach the waiting area to board the ferry, you realize you're so early, nobody else has even arrived yet!

By modeling the process people use to choose (or abandon) their seat in the waiting area, you're pretty sure you can predict the best place to sit. You make a quick map of the seat layout (your puzzle input).

The seat layout fits neatly on a grid. Each position is either floor (.), an empty seat (L), or an occupied seat (#). For example, the initial seat layout might look like this:

L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL
Now, you just need to model the people who will be arriving shortly. Fortunately, people are entirely predictable and always follow a simple set of rules. All decisions are based on the number of occupied seats adjacent to a given seat (one of the eight positions immediately up, down, left, right, or diagonal from the seat). The following rules are applied to every seat simultaneously:

If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
Otherwise, the seat's state does not change.
Floor (.) never changes; seats don't move, and nobody sits on the floor.

After one round of these rules, every seat in the example layout becomes occupied:

#.##.##.##
#######.##
#.#.#..#..
####.##.##
#.##.##.##
#.#####.##
..#.#.....
##########
#.######.#
#.#####.##
After a second round, the seats with four or more occupied adjacent seats become empty again:

#.LL.L#.##
#LLLLLL.L#
L.L.L..L..
#LLL.LL.L#
#.LL.LL.LL
#.LLLL#.##
..L.L.....
#LLLLLLLL#
#.LLLLLL.L
#.#LLLL.##
This process continues for three more rounds:

#.##.L#.##
#L###LL.L#
L.#.#..#..
#L##.##.L#
#.##.LL.LL
#.###L#.##
..#.#.....
#L######L#
#.LL###L.L
#.#L###.##
#.#L.L#.##
#LLL#LL.L#
L.L.L..#..
#LLL.##.L#
#.LL.LL.LL
#.LL#L#.##
..L.L.....
#L#LLLL#L#
#.LLLLLL.L
#.#L#L#.##
#.#L.L#.##
#LLL#LL.L#
L.#.L..#..
#L##.##.L#
#.#L.LL.LL
#.#L#L#.##
..L.L.....
#L#L##L#L#
#.LLLLLL.L
#.#L#L#.##
At this point, something interesting happens: the chaos stabilizes and further applications of these rules cause no seats to change state! Once people stop moving around, you count 37 occupied seats.

Simulate your seating area by applying the seating rules repeatedly until no seats change state. How many seats end up occupied?

--- Part Two ---
As soon as people start to arrive, you realize your mistake. People don't just care about adjacent seats - they care about the first seat they can see in each of those eight directions!

Now, instead of considering just the eight immediately adjacent seats, consider the first seat in each of those eight directions. For example, the empty seat below would see eight occupied seats:

.......#.
...#.....
.#.......
.........
..#L....#
....#....
.........
#........
...#.....
The leftmost empty seat below would only see one empty seat, but cannot see any of the occupied ones:

.............
.L.L.#.#.#.#.
.............
The empty seat below would see no occupied seats:

.##.##.
#.#.#.#
##...##
...L...
##...##
#.#.#.#
.##.##.
Also, people seem to be more tolerant than you expected: it now takes five or more visible occupied seats for an occupied seat to become empty (rather than four or more from the previous rules). The other rules still apply: empty seats that see no occupied seats become occupied, seats matching no rule don't change, and floor never changes.

Given the same starting layout as above, these new rules cause the seating area to shift around as follows:

L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL
#.##.##.##
#######.##
#.#.#..#..
####.##.##
#.##.##.##
#.#####.##
..#.#.....
##########
#.######.#
#.#####.##
#.LL.LL.L#
#LLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLL#
#.LLLLLL.L
#.LLLLL.L#
#.L#.##.L#
#L#####.LL
L.#.#..#..
##L#.##.##
#.##.#L.##
#.#####.#L
..#.#.....
LLL####LL#
#.L#####.L
#.L####.L#
#.L#.L#.L#
#LLLLLL.LL
L.L.L..#..
##LL.LL.L#
L.LL.LL.L#
#.LLLLL.LL
..L.L.....
LLLLLLLLL#
#.LLLLL#.L
#.L#LL#.L#
#.L#.L#.L#
#LLLLLL.LL
L.L.L..#..
##L#.#L.L#
L.L#.#L.L#
#.L####.LL
..#.#.....
LLL###LLL#
#.LLLLL#.L
#.L#LL#.L#
#.L#.L#.L#
#LLLLLL.LL
L.L.L..#..
##L#.#L.L#
L.L#.LL.L#
#.LLLL#.LL
..#.L.....
LLL###LLL#
#.LLLLL#.L
#.L#LL#.L#
Again, at this point, people stop shifting around and the seating area reaches equilibrium. Once this occurs, you count 26 occupied seats.

Given the new visibility method and the rule change for occupied seats becoming empty, once equilibrium is reached, how many seats end up occupied?



*/

let fs = require("fs");
let text = fs.readFileSync("./input.txt");
let entriesArray = text.toString().split("\n");

function manipulateSeat(seatIndex, rowLength, columnLength, seatingString) {
    if (seatingString[seatIndex] === '.') {
        return seatingString[seatIndex];
    }
    //console.log('starting seatIndex: ' + seatIndex);
    let rowIndex = Math.floor(seatIndex / columnLength);
    let columnIndex = seatIndex % columnLength;
    let numberOfAdjacentTakenSeats = 0;
    for (let i = -1; i <= 1; i++) {
        if (rowIndex + i >= 0 && rowIndex + i < rowLength) {
            for (let j = -1; j <= 1; j++) {
                if (columnIndex + j >= 0 && columnIndex + j < columnLength) {
                    let checkingSeatIndex = (i * columnLength) + j + seatIndex;
                    if (checkingSeatIndex !== seatIndex) {
                        //console.log('Testing seat index: ' + checkingSeatIndex);
                        let valueAtPosition = seatingString[checkingSeatIndex];
                        //console.log('Checking: (' + (rowIndex + i) + ', ' + (columnIndex + j ) + ') - ' + valueAtPosition);
                        if (valueAtPosition && valueAtPosition === '#')  {
                            numberOfAdjacentTakenSeats ++;
                        }
                    }
                }
            }
        }
    }

    //console.log('seatIndex: ' + seatIndex + ' adjecent seats taken: ' + numberOfAdjacentTakenSeats);

    if (numberOfAdjacentTakenSeats === 0) {
        return '#';
    } else if (numberOfAdjacentTakenSeats >= 4) {
        return 'L';
    } else {
        return seatingString[seatIndex];
    }
}

function checkSingleDirection(rowIncrement, columnIncrement, initialRow, initialColumn, rowLength, columnLength, seatingString) {
    let reachedEnd = false;
    let rowIndex = initialRow;
    let colIndex = initialColumn;
    let foundTakenSeat = false;
    while (!reachedEnd) {
        rowIndex += rowIncrement;
        colIndex += columnIncrement;
        if (rowIndex >= 0 && rowIndex < rowLength && colIndex >= 0 && colIndex < columnLength && !(rowIncrement === 0 && columnIncrement === 0)) {
            let checkingSeatIndex = (rowIndex * columnLength) + colIndex;
            if (seatingString[checkingSeatIndex] === '#') {
                //console.log('Found taken seat at: (' + rowIndex + ', ' + colIndex + ') with index: ' + checkingSeatIndex);
                foundTakenSeat = true;
                reachedEnd = true;
            } else if (seatingString[checkingSeatIndex] === 'L') {
                reachedEnd = true;
            }
        } else {
            reachedEnd = true;
        }
    }

    return foundTakenSeat;
}

function manipulateSeatV2(seatIndex, rowLength, columnLength, seatingString) {
    if (seatingString[seatIndex] === '.') {
        return seatingString[seatIndex];
    }
    //console.log('starting seatIndex: ' + seatIndex);
    let rowIndex = Math.floor(seatIndex / columnLength);
    let columnIndex = seatIndex % columnLength;
    let numberOfVisibleTakenSeats = 0;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if(checkSingleDirection(i, j, rowIndex, columnIndex, rowLength, columnLength, seatingString)) {
                numberOfVisibleTakenSeats ++;
            }
        }
    }

    //console.log('seatIndex: ' + seatIndex + ' adjecent seats taken: ' + numberOfVisibleTakenSeats);

    if (numberOfVisibleTakenSeats === 0) {
        return '#';
    } else if (numberOfVisibleTakenSeats >= 5) {
        return 'L';
    } else {
        return seatingString[seatIndex];
    }
}

let rowLength = entriesArray.length;
let columnLength = entriesArray[0].length;
let seatingString = '';

for (let i = 0; i < entriesArray.length; i++) {
    seatingString += entriesArray[i];
}

function calculateNewSeatingArrangement(seatingString) { 
    let newSeatingString = '';
    for (let i = 0; i < seatingString.length; i++) {
        newSeatingString += manipulateSeatV2(i, rowLength, columnLength, seatingString);
    }

    return newSeatingString;
}

let maxAttempts = 0;
let currentSeatingString = seatingString;
let finalSeatingString = calculateNewSeatingArrangement(currentSeatingString);


while (finalSeatingString !== currentSeatingString && maxAttempts <= 5000) {
    //console.log('currentSeatingString: \n' + currentSeatingString.replace(new RegExp("(.{" + columnLength + "})", "g"), "$1\n"));
    //console.log('finalSeatingString: \n' + finalSeatingString.replace(new RegExp("(.{" + columnLength + "})", "g"), "$1\n"));
    currentSeatingString = finalSeatingString;
    finalSeatingString = calculateNewSeatingArrangement(finalSeatingString);
    maxAttempts++;
}


console.log("Seating String: " + seatingString);
console.log('rowLength: ' + rowLength);
console.log('columnLength: ' + columnLength);
console.log('Final Seating arrangement: \n' + finalSeatingString.replace(new RegExp("(.{" + columnLength + "})", "g"), "$1\n"));
console.log('Number of occupied seats: ' + (finalSeatingString.split("#").length - 1));
console.log('maxAttempts: ' + maxAttempts);

