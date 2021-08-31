const boardSize = 9;
const gridSize = 3;

class SudokuGame {
    constructor(values = null) {
        this.board = [];
        let pregen = values !== null;
        if (!pregen) { values = [0]; }
        while (values.includes(0)) {
            values = [];
            for (let x = 1; x <= boardSize ** 2; x++) {
                if (x < boardSize) {
                    values.push(x);
                } else {
                    values.push(0);
                }
            }
            shuffleArray(values);
            while (values.includes(0)) {
                let least = -1;
                let least_options = [1,2,3,4,5,6,7,8,9,10];
                // iterate the whole board for the least flexible cell with no value
                for (let cell = least + 1; cell < values.length; cell++) {
                    if (values[cell] !== 0) {
                        continue
                    }
                    var options = [1,2,3,4,5,6,7,8,9];
                    // Search neighbors for option elimination
                    const neighbors = this.cellNeighbors(cell);
                    for (let n = 0; n < neighbors.length; n++) {
                        if (options.includes(values[neighbors[n]])) {
                            options.splice(options.indexOf(values[neighbors[n]]), 1);
                        }
                    }
                    if (options.length < least_options.length) {
                        least = cell;
                        least_options = options;
                    }
                    if (options.length === 0) {
                        break;
                    }
                }
                if (least_options.length > 0) {
                    values[least] = randomArray(least_options);
                } else {
                    break;
                }
            }
            
        }
        for (let i = 0; i < values.length; i++) {
            this.board.push(new SudokuCell(i,values[i]));
        }
        if (!pregen)
            this.generateEasy();
    }

    generateEasy() {
        let indexes = [];
        for (let i = 0; i < 81; i++) {
            indexes.push(i);
        }
        shuffleArray(indexes);

        let removed = true;
        while (removed) {
            removed = false;
            for (let i = 0; i < indexes.length; i++) {
                let eliminatable = this.elimination(indexes[i]).size === boardSize - 1;
                let inversible = this.inverseElimination(indexes[i]).size === boardSize - 1;
                if (eliminatable || inversible) {
                    this.board[indexes[i]].removeHint();
                    indexes.splice(i, 1);
                    removed = true;
                }
            }
        }
    }

    columnIndexes(index) {
        if (index >= 81 || index < 0)
            throw new Error('Invalid cell index.');
        let indexes = [];
        let startingIndex = index % boardSize;
        for (let y = 0; y < boardSize; y++) {
            indexes.push(startingIndex + y * boardSize);
        }
        return indexes;
    }

    rowIndexes(index) {
        if (index >= 81 || index < 0)
            throw new Error('Invalid cell index.');
        let indexes = [];
        let startingIndex = index - index % boardSize;
        for (let x = 0; x < boardSize; x++) {
            indexes.push(startingIndex + x);
        }
        return indexes;
    }

    boxIndexes(index) {
        if (index >= 81 || index < 0) {
            throw new Error('Invalid cell index.');
        }
        let indexes = [];
        let startingIndex = (index - 9 * (Math.floor(index / 9) % 3)) - (index - 9 * (Math.floor(index / 9) % 3)) % 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                indexes.push(startingIndex + i + j * 9);
            }
        }
        return indexes;
    }

    cellNeighbors(index, exclude=false) {
        let col = this.columnIndexes(index);
        const row = this.rowIndexes(index);
        const box = this.boxIndexes(index);
        for (let i = 0; i < boardSize; i++) {
            if (!col.includes(row[i])) {
                col.push(row[i]);
            }
            if (!col.includes(box[i])) {
                col.push(box[i]);
            }
        }
        if (exclude)
            col.splice(col.indexOf(+index), 1);
        return col;
    }

    validate() {
        if (this.board.length !== boardSize ** 2)
            return false;

        for (let i = 0; i < boardSize ** 2; i++) {
            let neighbors = this.cellNeighbors(i);
            for (let j = 0; j < neighbors.length; j++) {
                if (this.board[i].value === this.board[neighbors[j]].value) {
                    return false;
                }
            }
        }
        return true;
    }

    // Solving Techniques
    // Returns true or false depending on if the rule alone is capable of solving
    // EASY
    elimination(cell) {
        let eliminated = new Set();
        for (let neighbor of this.cellNeighbors(cell, true)) {
            if (this.board[neighbor].value !== null) {
                eliminated.add(this.board[neighbor].value);
            }
        }
        return eliminated;
    }

    inverseElimination(cell) {
        // temporarily remove any value as it will be in the way
        const prevValue = this.board[cell].value;
        this.board[cell].value = null;

        let separatedNeighbors = [this.rowIndexes(cell, true), this.columnIndexes(cell, true), this.boxIndexes(cell, true)];
        for (let neighbors of separatedNeighbors) {
            // Intersect every neighbor's elimination
            let intersect = new Set([1,2,3,4,5,6,7,8,9].filter(i => !this.elimination(cell).has(i)))
            
            for (let neighbor of neighbors) {
                if (neighbor === cell) { continue; }
                if (this.board[neighbor].value === null) {
                    let compared = this.elimination(neighbor);
                    intersect = new Set([...intersect].filter(i => compared.has(i)));
                } else {
                    intersect.delete(this.board[neighbor].value);
                }
                
            }
            // Any remainder is a solution
            if (intersect.size === 1) {
                let result = new Set([1,2,3,4,5,6,7,8,9]);
                result.delete(intersect.values().next().value);
                this.board[cell].value = prevValue;
                return result;
            }
        }
        // getting here means no solution was found.
        // therefore nothing was eliminated.
        this.board[cell].value = prevValue;
        return new Set();
    }




}