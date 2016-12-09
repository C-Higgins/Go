class Game extends React.Component {
	constructor(){
		super();
		this.state = { //initial
			history: [
			{squares: Array(9).fill('')}
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
		console.log('handling a click')
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
	render() {
		const squares = this.props.squares.slice()
		const pieces = squares.map((s, i) => {
			return <Square value = {s} index={i} onClick={() => this.props.onClick(i)} />
		})
		return (
			<div id = 'board'>
				{pieces}
			</div>
		);
	}
}

class Square extends React.Component {
	calcStyle(){
		let xmult = this.props.index % 3
		let ymult = Math.floor(this.props.index / 3)
		let pixels = 75 //the square width
		let style = {
			position: 'absolute',
			zIndex: 1,
			fontSize: 40,
			width: pixels,
			height: pixels,
			lineHeight: pixels+'px',
			textAlign: 'center',
			transform: `translate(${pixels*xmult}px, ${pixels*ymult}px)`
		}

		return style;
	}
	render() {
		const x = 75 * this.props.index //calc actual positioning later
		return (
			<stone className='mark' key={this.props.index} style = {this.calcStyle()} onClick={()=>this.props.onClick()}>
			{this.props.value}
			</stone>
		);
	}
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