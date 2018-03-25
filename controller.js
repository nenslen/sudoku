
// Create sudoku grid
let table = document.getElementById('sudokuTable');
let tbody = document.createElement('tbody');
table.appendChild(tbody);

for(let i = 0; i < 9; i++) {
	let tr = document.createElement('tr');
	tbody.appendChild(tr);

	for(let j = 0; j < 9; j++) {
		let td = document.createElement('td');
		let input = document.createElement('input');
		input.setAttribute('type', 'number');
		input.id = i.toString() + j.toString();

		td.appendChild(input);
		tr.appendChild(td);
	}
}


// Create sudoku square objects
let squares = [];
for(let i = 0; i < 9; i++) {
	squares[i] = [];
	for(let j = 0; j < 9; j++) {
		squares[i][j] = new Square(i, j, 0, []);

		for(let d = 1; d <= 9; d++) {
			squares[i][j].domain.push(d);
		}
	}
}


// Reset values of all squares
function resetButtonClick() {
	for(let i = 0; i < 9; i++) {
		for(let j = 0; j < 9; j++) {
			let square = document.getElementById(i.toString() + j.toString());
			square.value = '';
		}
	}

	document.getElementById('failure').innerHTML = '';
}


// Find solution and display it
function solveButtonClick() {
	
	// Set values of all squares
	for(let i = 0; i < 9; i++) {
		for(let j = 0; j < 9; j++) {
			let square = document.getElementById(i.toString() + j.toString());
			let value = square.value;

			// Set squares to the value inside them (empty = 0)
			if(value == '') {
				squares[i][j].value = 0;
			} else {
				squares[i][j].value = parseInt(value);
			}
		}
	}


	// Get solution
	let result = solve(squares);


	// Display solution if it exists
	if(!result.failure) {
		
		// Update squares to show solution
		for(let i = 0; i < 9; i++) {
			for(let j = 0; j < 9; j++) {
				let square = document.getElementById(i.toString() + j.toString());
				let value = result.squares[i][j].value;

				square.value = value.toString();
			}
		}

		document.getElementById('failure').innerHTML = 'Success!';
	} else {
		document.getElementById('failure').innerHTML = 'No solution exists!';
	}
}
