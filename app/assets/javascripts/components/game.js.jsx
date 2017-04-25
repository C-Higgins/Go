let gv = {};

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = { //initial
			history:   props.game.history,
			blackNext: props.game.history.length % 2 != 0,
			move:      props.game.history.length - 1,
			completed: props.game.completed,
			result:    props.game.result,
			resign:    false
		}

	}

	componentDidMount() {
		let react = this
		if (wrapper = document.getElementById('gamewrapper')) {
			App.gameRoom = App.cable.subscriptions.create({channel: "GameroomChannel", room: wrapper.dataset.roomId}, {
				connected: function () {
					// Called when the subscription is ready for use on the server
					console.log('connected to room')
					$(document).on('page:change', function () {
						this.unsubscribe();
					})
				},

				disconnected: function () {
					// Called when the subscription has been terminated by the server
					console.log('left room')
				},
				received:     function (data) {
					let id = JSON.parse(this.identifier).room
					console.log('websocket data recieved on channel   ' + id)
					react.router(data, id)
				}
			})
		}
	}

	router(data, id) {
		// Comes in from componentdidmount
		if (data.message) {
			this.gameOver(data);
		} else if (data.draw_request) {
			this.receive_draw(data.requester)
		} else if (data.takeback_request) {
			this.receive_takeback(data.requester)
		}
		else if (id == this.props.game.webid) {
			this.setState({
				history:   this.state.history.concat(data.move),
				move:      this.state.move + 1,
				blackNext: !this.state.blackNext
			})
		}
	}

	gameOver(data) {
		//timer.stop()
		//this.setState({win/loss info})
		this.setState({
			completed: true,
			result:    data.message
		})
	}

	handleClick(i) {
		console.log('handling a click')
		this.setState({resign: false})
		// Check that it's your turn
		if ((this.props.color != this.state.blackNext) || this.state.completed) {
			return;
		}

		const history = this.state.history
		const current = history[history.length - 1]
		const squares = current.slice()

		if (squares[i])
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

	offer_takeback() {
		App.gameRoom.send({
			takeback_request: true,
			requester:        this.props.me.id
		})
	}

	receive_takeback(requester) {
		if (requester == this.props.me.id) {
			//I sent a takeback request
		} else {
			//I received a takeback request
		}
	}

	accept_takeback() {

	}

	offer_draw() {
		App.gameRoom.send({
			draw_request: true,
			requester:    this.props.me.id
		})
	}

	receive_draw(requester) {
		if (requester == this.props.me.id) {
			//I sent a draw request
		} else {
			//I received a draw request
		}
	}

	accept_draw() {

	}

	resign() {
		if (this.state.resign) {
			App.gameRoom.send({
				resign: true
			})
			this.setState({resign: false})
		} else {
			this.setState({resign: true})
		}
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

		let result, indicator
		if (this.state.completed)
			result = this.state.result

		indicator = this.props.color == this.state.blackNext
		return (
			<game>
				<Board squares={current} onClick={(i) => this.handleClick(i)}/>
				<Infobox result={result}
						 indicator={indicator}
						 moves={moves}
						 moveNum={this.state.move}
						 jumpTo={(m) => this.jumpTo(m)}
						 resignConfirmation={this.state.resign}
						 p1={this.props.p1}
						 p2={this.props.p2}
						 pass={() => this.pass()}
						 takeback={() => this.offer_takeback()}
						 draw={() => this.offer_draw()}
						 resign={() => this.resign()}
				/>
			</game>
		);
	}
}

class Infobox extends React.Component {
	render() {
		//temporary
		let p1indicator, p2indicator
		if (!this.props.result) {
			if (this.props.indicator) {
				p1indicator = <span className="indicator">    &lt;--</span>
				p2indicator = ''
			} else {
				p2indicator = <span className="indicator">    &lt;--</span>
				p1indicator = ''
			}
		} else {
			p1indicator = p2indicator = ''
		}
		return (
			<div id="controlBox">
				{this.props.result}
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
					<control
						onClick={() => this.props.resign()}>{this.props.resignConfirmation ? 'Sure?' : 'Resign'}</control>
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