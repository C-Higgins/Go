let gv = {};

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = { //initial
			history:   props.game.history,
			blackNext: props.game.history.length % 2 != 0,
			move:      props.game.history.length - 1
		}

	}

	componentWillMount() {
		gv.callback = (data, id) => { // Comes in from gameroom.js.erb
			if (data.winner) {
				return this.gameOver(data);
			} else if (id == this.props.game.webid) {
				this.setState({
					history:   this.state.history.concat(data.move),
					move:      this.state.move + 1,
					blackNext: !this.state.blackNext
				})
			}
		}
	}

	gameOver(data) {
		//timer.stop()
		//this.setState({win/loss info})
	}

	handleClick(i) {
		console.log('handling a click')
		// Check that it's your turn
		if (this.props.color != this.state.blackNext) {
			return;
		}

		const history = this.state.history
		const current = history[history.length - 1]
		const squares = current.slice()

		if (squares[i] || calculateWinner(squares))
			return;
		this.state.blackNext ? squares[i] = 'B' : squares[i] = 'W'

		//set board state here without setting move list

		App.gameRoom.send({
			newMove: {
				index: i,
				color: squares[i],
				pass:  false,
			}
		})
		// -> gameroom_channel#receive
	}

	pass() {
		App.gameRoom.send({
			newMove: {
				pass: true,
			}
		})
	}

	jumpTo(step) {
		if ((step >= this.state.history.length) || step < 0) return;
		this.setState({
			move:    step,
			xIsNext: (!(step % 2)),
		});
	}

	render() {
		const history = this.state.history
		const current = history[this.state.move]
		const winner = calculateWinner(current)

		const moves = history.map((step, move) => {
			const desc = move ?
				'Move #' + move :
				'Game start';
			return (
				<li key={move}>
					<a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
				</li>
			);
		});

		let status
		if (winner)
			status = `Winner: ${winner}`
		else
			status = this.props.color == this.state.blackNext
		return (
			<game>
				<Board squares={current} onClick={(i) => this.handleClick(i)}/>
				<Infobox status={status} moves={moves} moveNum={this.state.move} jumpTo={(m) => this.jumpTo(m)}
						 pass={() => this.pass()} p1={this.props.p1} p2={this.props.p2}/>
			</game>
		);
	}
}

class Infobox extends React.Component {
	render() {
		//temporary
		let p1indicator, p2indicator
		if (this.props.status) {
			p1indicator = <span className="indicator">    &lt;--</span>
			p2indicator = ''
		} else {
			p2indicator = <span className="indicator">    &lt;--</span>
			p1indicator = ''
		}

		return (
			<div id="controlBox">
				<div className="player-name">{this.props.p2.display_name}{p2indicator}</div>
				<div id="history-buttons">
					<control onClick={() => this.props.jumpTo(1)}> &lt;&lt; </control>
					<control onClick={() => this.props.jumpTo(this.props.moveNum - 1)}> &lt; </control>
					<control onClick={() => this.props.jumpTo(this.props.moveNum + 1)}> &gt; </control>
					<control onClick={() => this.props.jumpTo(this.props.moves.length - 1)}> &gt;&gt; </control>
				</div>
				<div id="moveList">
					<ol>{this.props.moves}</ol>
				</div>
				<div id="history-buttons">
					<control onClick={() => this.props.pass()}>Pass</control>
					<control>Takeback</control>
					<control>Draw</control>
					<control>Resign</control>
				</div>
				<div className="player-name">{this.props.p1.display_name}{p1indicator}</div>
			</div>
		)
	}
}

class Board extends React.Component {
	render() {
		const squares = this.props.squares.slice()
		const pieces = squares.map((s, i) => {
			return <Square value={s} index={i} key={i} onClick={() => this.props.onClick(i)}/>
		})
		return (
			<board>
				{pieces}
			</board>
		);
	}
}

class Square extends React.Component {
	calcStyle() {
		const size = 19;
		const pixels = 30; //the square width
		const xmult = this.props.index % size;
		const ymult = Math.floor(this.props.index / size);
		const position = {transform: `translate(${pixels * xmult + 15}px, ${pixels * ymult + 15}px)`}

		let piece = this.props.value;
		if (piece == 'W') {
			return {
				...position,
				backgroundImage: `url('../images/whitedot.png')`
			}
		} else if (piece == 'B') {
			return {
				...position,
				backgroundImage: `url('../images/blackdot.png')`
			}
		} else {
			return position;
		}
	}

	render() {
		return (
			<stone key={this.props.index} style={this.calcStyle()}
				   onClick={() => this.props.onClick()}>

			</stone>
		);
	}
}
// ========================================


function calculateWinner(squares) {
	// const lines = [
	//     [0, 1, 2],
	//     [3, 4, 5],
	//     [6, 7, 8],
	//     [0, 3, 6],
	//     [1, 4, 7],
	//     [2, 5, 8],
	//     [0, 4, 8],
	//     [2, 4, 6],
	// ];
	// for (let i = 0; i < lines.length; i++) {
	//     const [a, b, c] = lines[i];
	//     if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
	//         return squares[a];
	//     }
	// }
	return null;
}
