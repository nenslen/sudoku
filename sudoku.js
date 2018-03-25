
/**
* A Square object. Represents a single square on the sudoku board. Each square has a row, column, value, and domain
* @param row: The square's row
* @param col: The square's column
* @param value: The square's value
* @param domain: An array of integers, representing the domain (ie. the possible values this square can be) of the square
*/
function Square(row, col, value, domain) {
	this.row = row;
	this.col = col;
	this.value = value;
	this.domain = domain;
}


/**
* The sudoku constraint satisfaction problem (csp). Contains a 2D array of squares to represent the sudoku board,
* and a boolean indicating if the current state is a failure. A CSP has 3 parts:
*    1. Variables: Each variable in this problem is represented by a square. Each square has a 'value' property.
*    2. Domains: Each square has a 'domain' property, which represents the possible values it can be.
*    3. Constraints: The constraints aren't directly represented in this CSP. Instead, they are applied by the updateDomains
*       function to ensure that each unit (row, column, and 3x3 box) has unique values.
* @param squares: A 2D array of squares, representing the sudoku board
* @param failure: A boolean indicating if the current state is a failure
*/
function SudokuCSP(squares, failure) {
	this.squares = copySquares(squares);
	this.failure = failure;
}


/**
* Performs the backtracking algorithm on a given sudoku board
* @param squares: A 2D array of squares, representing the sudoku board
* @return: A SudokuCSP object representing the result of the backtracking algorithm
*/
function solve(squares) {

	// Update all domains to match any pre-filled squares
	let newSquares = copySquares(squares);
	updateAllDomains(newSquares);


	// Begin backtracking and return the result
	return backtrack(new SudokuCSP(newSquares, false));
}


/**
* The backtracking function. Solves a given sudoku puzzle and returns a solution of a failure if there
* was no solution.
* @param squares: A 2D array of squares, representing the sudoku board
* @param failure: A boolean indicating if the puzzle could be solved
* @return: A 2D array of squares, representing the solved state
*/
function backtrack(sudoku) {

	// Return if squares are all filled in
	if(isFull(sudoku.squares)) {
		return sudoku;
	}


	// Choose the next square to fill in
	let square = getEmptySquare(sudoku.squares);


	// Check each possible value for the square
	for(var i = 0; i < square.domain.length; i++) {

		// Copy the squares
		let newSquares = copySquares(sudoku.squares);


		// Get the value to check
		let value = square.domain[i];


		// Set the value of the square
		newSquares[square.row][square.col].value = value;


		// Update domains of squares affected by the new value
		let success = updateDomains(newSquares, square.row, square.col);


		// Check if updating the domains was a success
		if(success) {

			// The current sudoku board is valid, so continue checking
			let result = backtrack(new SudokuCSP(newSquares, false));


			// Return the result if it didn't fail
			if(!result.failure) {
				return result;
			}
		}
	}


	// This board is invalid, so return a failure
	return new SudokuCSP(sudoku.squares, true);
}


/**
* Checks whether a given sudoku board is full
* @param squares: A 2D array of squares, representing the sudoku board
* @return: True if all squares are filled in, false otherwise
*/
function isFull(squares) {
	for(let i = 0; i < squares.length; i++) {
		for(let j = 0; j < squares.length; j++) {
			if(squares[i][j].value == 0) {
				return false;
			}
		}
	}

	return true;
}


/**
* Chooses the next square to fill in
* @param squares: A 2D array of squares, representing the sudoku board
* @return: An empty square on the board
*/
function getEmptySquare(squares) {
	for(let i = 0; i < squares.length; i++) {
		for(let j = 0; j < squares.length; j++) {
			if(squares[i][j].value == 0) {
				return squares[i][j];
			}
		}
	}

	return new Square(-1, -1, -1, []);
}


/**
* Returns a copy of a given set of squares
* @param squares: The squares to copy
* @return: A copy of the given squares
*/
function copySquares(squares) {
	let newSquares = [];

	for(var i = 0; i < squares.length; i++) {
		newSquares[i] = [];
		for(var j = 0; j < squares.length; j++) {
			let s = squares[i][j];
			newSquares[i][j] = new Square(s.row, s.col, s.value, s.domain.slice(0));
		}
	}

	return newSquares;
}


/**
* Updates the domains of squares affected by changing the value of a given square
* @param squares: A 2D array of squares, representing the sudoku board
* @param row: The row of the changed square
* @param col: The column of the changed square
* @return: False if any square's domain is empty, true otherwise
*/
function updateDomains(squares, row, col) {

	// Get value of updated square
	let newValue = squares[row][col].value;


	// If square is empty, don't update any domains
	if(newValue == 0) {
		return true;
	}


	// Set domain of changed square to a single value (the value it was changed to)
	squares[row][col].domain = [newValue];


	// Update row and column domains (excluding the domain of the changed square)
	for(var i = 0; i < squares.length; i++) {

		// Row
		let index = squares[row][i].domain.indexOf(newValue);
		if(index != -1 && i != col) {
			//console.log(index);
			squares[row][i].domain.splice(index, 1);
		}


		// Col
		index = squares[i][col].domain.indexOf(newValue);
		if(index != -1 && i != row) {
			squares[i][col].domain.splice(index, 1);
		}


		// Return false if any domain is empty (ie. the puzzle is unsolvable from this point)
		if(squares[row][i].domain.length == 0 || squares[i][col].domain.length == 0) {
			return false;
		}
	}


	// Update 3x3 box domain (excluding the domain of the changed square)
	let r = 0;
	if(row >= 0 && row <= 2) { r = 0; }
	if(row >= 3 && row <= 5) { r = 3; }
	if(row >= 6 && row <= 8) { r = 6; }

	let c = 0;
	if(col >= 0 && col <= 2) { c = 0; }
	if(col >= 3 && col <= 5) { c = 3; }
	if(col >= 6 && col <= 8) { c = 6; }

	for(var i = r; i < r + 3; i++) {
		for(var j = c; j < c + 3; j++) {
			let index = squares[i][j].domain.indexOf(newValue);
			if(index != -1 && !(i == row && j == col)) {
				squares[i][j].domain.splice(index, 1);
			}

			if(squares[i][j].domain.length == 0) {
				return false;
			}
		}
	}


	// Return true because all squares still have a non-empty domain
	return true;
}


/**
* Updates the domains of all squares. This is called before starting the backtracking algorithm because
* some squares may be pre-filled in already, so we need to set the initial domains of the problem.
* @param squares: A 2D array of squares, representing the sudoku board
* @return: False if any square's domain is empty, true otherwise
*/
function updateAllDomains(squares) {
	for(var i = 0; i < squares.length; i++) {
		for(var j = 0; j < squares.length; j++) {
			let valid = updateDomains(squares, i, j);
			if(!valid) {
				return false;
			}
		}
	}

	return true;
}
