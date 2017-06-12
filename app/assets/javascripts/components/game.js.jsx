class GameRoom extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			ready:              props.ready,
			p2:                 props.p2,
			history:            props.game.history,
			blackNext:          props.game.history.length % 2 != 0,
			move:               props.game.history.length - 1,
			completed:          props.game.completed,
			result:             props.game.result,
			resignConfirmation: false,
			messages:           props.game.messages,
			score:              props.game.score,
		}

	}

	componentDidMount() {
		App.gameRoom = App.cable.subscriptions.create({channel: "GameroomChannel", room: this.props.game.webid}, {
			connected:    () => {
				// Called when the subscription is ready for use on the server
				console.log('connected to room')
			},
			disconnected: () => {
				// Called when the subscription has been terminated by the server
				console.log('left room')
			},
			received:     data => {
				console.log('websocket data recieved on channel   ' + this.props.game.webid)
				/*
				 Receive:
				 game_over: string
				 chat: {
				 message: string
				 author: string
				 }
				 friend_joined: <Player>
				 move: string[]
				 drawr:
				 taker:

				 Send:
				 move: {
				 pass: bool
				 index: int
				 }
				 chat: string
				 resign: bool
				 offerd: bool
				 offert: bool
				 */

				if (data.game_over) {
					this.gameOver(data.game_over);
				} else if (data.chat) {
					this.setState((prevState) => ({
						messages: prevState.messages.concat({author: data.chat.author, message: data.chat.message})
					}))
				} else if (data.draw_request) {
					this.receive_draw(data.requester)
				} else if (data.takeback_request) {
					this.receive_takeback(data.requester)
				} else if (data.friend_joined) {
					let p2 = data.friend_joined
					p2.color = !this.props.p1.color
					this.setState({p2: p2, ready: true})
				} else if (data.move) {
					this.setState({
						history:   this.state.history.concat(data.move),
						move:      this.state.move + 1,
						blackNext: !this.state.blackNext
					})
				}
			}
		})
	}

	gameOver(result) {
		//timer.stop()
		//this.setState({win/loss info})
		this.setState({
			completed: true,
			result:    result,
		})
	}

	handleClick(i) {
		console.log('handling a click')
		this.setState({resignConfirmation: false})
		// Check that it's your turn
		if ((this.props.color !== this.state.blackNext) || this.state.completed) {
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
			move: {
				index: i,
				pass:  false,
			}
		})
		// -> gameroom_channel#receive
	}

	static pass() {
		App.gameRoom.send({
			move: {
				pass: true,
			}
		})
	}

	static offer_takeback() {
		App.gameRoom.send({
			takeback_request: true
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

	static offer_draw() {
		App.gameRoom.send({
			draw_request: true
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
		if (this.state.resignConfirmation) {
			App.gameRoom.send({
				resign: true
			})
			this.setState({resignConfirmation: false})
		} else {
			this.setState({resignConfirmation: true})
		}
	}

	jumpTo(step) {
		if ((step >= this.state.history.length) || step < 0) return;
		this.setState({
			move:    step,
			xIsNext: (!(step % 2)),
		});
	}

	static sendChat(message) {
		App.gameRoom.send({
			chat: message
		})
	}

	render() {
		if (!this.state.ready) {
			return (<WaitingRoom />)
		} else {
			return (<Game {...this.props}
						  {...this.state}
						  p2={this.state.p2}
						  handleClick={(i) => this.handleClick(i)}
						  pass={() => this.pass()}
						  offer_takeback={() => this.offer_takeback()}
						  offer_draw={() => this.offer_draw()}
						  resign={() => this.resign()}
						  jumpTo={(move) => this.jumpTo(move)}
						  messages={this.state.messages}
						  sendChat={(m) => this.sendChat(m)}
				/>
			)
		}
	}
}

function Game(props) {
	const history = props.history
	const current = history[props.move]

	const moves = history.map((step, move) => {
		const desc = move ?
			'Move #' + move :
			'Game start';
		return (
			<li key={move}>
				<a href="#" onClick={() => props.jumpTo(move)}>{desc}</a>
			</li>
		);
	});


	const indicator = props.p1.color === props.blackNext
	return (
		<game>
			<Board squares={current} onClick={(i) => props.handleClick(i)}/>
			<Infobox result={props.result}
					 indicator={indicator}
					 moves={moves}
					 moveNum={props.move}
					 jumpTo={(m) => props.jumpTo(m)}
					 resignConfirmation={props.resignConfirmation}
					 p1={props.p1}
					 p2={props.p2}
					 pass={() => props.pass()}
					 takeback={() => props.offer_takeback()}
					 draw={() => props.offer_draw()}
					 resign={() => props.resign()}

					 messages={props.messages}
					 sendChat={(m) => props.sendChat(m)}
			/>
		</game>
	);
}

function Infobox(props) {
	//temporary
	const indicator = <span className="indicator">    &lt;--</span>

	return (
		<div id="controlBox">
			{props.result}
			<PlayerInfo
				player={props.p2}
				indicator={!props.indicator && !props.result && indicator}
			/>
			<div id="history-buttons">
				<control onClick={() => props.jumpTo(1)}> &lt;&lt; </control>
				<control onClick={() => props.jumpTo(props.moveNum - 1)}> &lt; </control>
				<control onClick={() => props.jumpTo(props.moveNum + 1)}> &gt; </control>
				<control onClick={() => props.jumpTo(props.moves.length - 1)}> &gt;&gt; </control>
			</div>
			<div id="moveList">
				<ol>{props.moves}</ol>
			</div>
			<div id="history-buttons">
				<control onClick={() => props.pass()}>Pass</control>
				<control>Takeback</control>
				<control>Draw</control>
				<control
					onClick={() => props.resign()}>{props.resignConfirmation ? 'Sure?' : 'Resign'}</control>
			</div>
			<PlayerInfo
				player={props.p1}
				indicator={props.indicator && !props.result && indicator}
				score={props.score}
			/>
			<Chat messages={props.messages} sendChat={(m) => props.sendChat(m)}/>
		</div>
	)

	function PlayerInfo(props) {
		return (
			<div className="player-name">
				<i className={`circle-${getColor(props.player.color)}`}/>
				{props.player.display_name}
				{props.indicator}
				{props.rating && <span className="rating"> ({props.rating})</span>}
				{props.score && <span className="score">{props.score}</span>}
			</div>
		)
	}

	function getColor(bool) {
		return bool ? 'black' : 'white'
	}
}

function Board(props) {
	const squares = props.squares.slice()
	const pieces = squares.map((s, i) => {
		return <Square value={s} index={i} key={i} onClick={() => props.onClick(i)}/>
	})
	return (
		<board>
			{pieces}
		</board>
	);
}

function Square(props) {
	function calcStyle() {
		const size = 19;
		const pixels = 30; //the square width
		const xmult = props.index % size;
		const ymult = Math.floor(props.index / size);
		const position = {transform: `translate(${pixels * xmult + 15}px, ${pixels * ymult + 15}px)`}

		let piece = props.value;
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

	return (
		<stone key={props.index} style={calcStyle()}
			   onClick={() => props.onClick()}>
		</stone>
	);

}

class WaitingRoom extends React.Component {
	constructor(props) {
		super(props)
		this.state = {flash: false}
		this.copy = this.copy.bind(this)
	}

	copy() {
		this.setState({flash: true})
		document.querySelector('.copy-box').select()
		document.execCommand('copy')
		window.getSelection().removeAllRanges()
		setTimeout(() => {
			this.setState({flash: false})
		}, 70)
	}

	render() {
		let classes = 'copy-box force-select'
		if (this.state.flash) classes += ' flash'

		return (
			<game>
				<div id="private-game-wait">
					<input type="text" className={classes} value={document.location.href} readOnly/>
					<button className="copy-button" onClick={this.copy}/>
					<p style={{fontSize: "1.5em"}}>
						Waiting for other player. You will play with the first person to visit this link.
					</p>
				</div>
			</game>
		)
			;
	}
}