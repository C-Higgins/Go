

class Game extends React.Component {
	constructor(){
		super();
		this.state = { //initial
			history: [
			{squares: Array(9).fill(null)}
			],
			xNext: true,
			move: 0
		}

	}
	// componentWillMount(){ // Set up from the backend passing. Consider it an ajax call
	// 	this.setState({ 
	// 		history: [
	// 		{squares: this.props.game.history}
	// 		],
	// 		xNext: true,
	// 		move: this.props.game.move
	// 	})
	// }
	handleClick(i){
		const history = this.state.history
		const current = history[history.length-1]
		const squares = current.squares.slice()

		if (squares[i] || calculateWinner(squares)) 
			return;
		this.setState({move: history.length})
		this.state.xNext ? squares[i] = 'X' : squares[i] = 'O'
		this.setState({
		    history: history.concat([{
		      squares: squares
		    }]),
		    xNext: !this.state.xNext,
		  });

		/* Send state through websocket here to update server and other client
		Other client would be like websocket.onrecieve(data, (data)=>setstate(data))
		And server has to save it to the db
		*/
	}

	jumpTo(step) {
	  this.setState({
	    move: step,
	    xIsNext: (step % 2) ? false : true,
	  });
	}
	render() {
		const history = this.state.history
		const current = history[this.state.move]
		const winner = calculateWinner(current.squares)

		const moves = history.map((step, move) => {
		  const desc = move ?
		    'Move #' + move :
		    'Game start';
		  return (
		    <li key={move}>
		      <a href="#" data-turbolinks="false" onClick={() => this.jumpTo(move)}>{desc}</a>
		    </li>
		  );
		});

		let status
		if (winner)
			status = `Winner: ${winner}`
		else 
			status = `Next player: ${this.state.xNext ? 'X' : 'O'}`;
		return (
			<div className="game">
				<div className="game-board">
					<Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
				</div>
				<div className="game-info">
					<div>{ status }</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

class Board extends React.Component {
	renderSquare(i) {
		return <Square value={this.props.squares[i]} onClick={ () => this.props.onClick(i)} />
		//Passes the onclick function referencing the handleclick function
		//so when you click a square it calls this 
	}
	render() {
		return (
			<div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

function Square(props){
	return (
		<button className="square" onClick={()=>props.onClick()}>
		{props.value}
		</button>
	);
}
// ========================================



function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}