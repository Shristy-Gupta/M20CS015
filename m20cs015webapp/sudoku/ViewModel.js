class ViewModel {
    constructor(model = null) {
        this.gameModel = model !== null ? model : new SudokuGame();
        this.display();
    }

    set selectedCell(cellIndex) {
        if (cellIndex !== null && (cellIndex < 0 || cellIndex >= 81)) {
            throw new Error('Cell index out of range. ' + cellIndex);
        }
        for (let i = 0; i < 81; i++) {
            let cell = document.getElementById('cell-'+i);
            let previousValue = cell.classList.contains('selected');
            cell.classList.remove('selected');
            if (i === cellIndex && !previousValue && !this.gameModel.board[cellIndex].isHint) {
                cell.classList.add('selected');
            }
        }
        this._selectedCell = cellIndex;
    }
    get selectedCell() {
        for (let i = 0; i < 81; i++) {
            if (document.getElementById('cell-'+i).classList.contains('selected')) {
                return i;
            }
        }
        return null;
    }

    fill(value) {
        if (this.selectedCell !== null) {
            this.gameModel.board[this.selectedCell].value = value;
            this.display();
        }
    }

    verify() {
        alert(this.gameModel.validate() ? 'Mission Accomplished!' : 'Keep Trying..');
    }

    display() {
        for (let cellModel of this.gameModel.board) {
            let cellView = document.getElementById('cell-'+cellModel.index);
            if (cellModel.isHint) {
                cellView.classList.add('hint');
            } else {
                cellView.classList.remove('hint');
            }
            cellView.innerText = cellModel.value === null ? "" : cellModel.value;
        }
    }
}

var viewModel = null;
window.onload = function () {
    viewModel = new ViewModel();
    viewModel.display();
}