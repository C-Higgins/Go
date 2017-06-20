class GameRoom extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			ready:              props.ready,
			p2:                 props.p2,
			history:            props.game.history,
			blackNext:          props.game.history.length % 2 !== 0,
			move:               props.game.history.length - 1,
			completed:          props.game.completed,
			result:             props.game.result,
			resignConfirmation: false,
			messages:           props.game.messages,
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
						messages: prevState.messages.concat(data.chat)
					}))
				} else if (data.draw_request) {
					this.receive_draw(data.requester)
				} else if (data.takeback_request) {
					this.receive_takeback(data.requester)
				} else if (data.friend_joined) {
					let p2 = data.friend_joined
					this.setState({p2: p2, ready: true})
				} else if (data.move) {
					const newHistory = this.state.history.concat(data.move)
					const move = newHistory.length - 1
					this.setState({
						history:   newHistory,
						move:      move,
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
			result:    result.message,
		})
	}

	handleClick(i) {
		console.log('handling a click')
		this.setState({resignConfirmation: false})
		// Check that it's your turn
		if (!this.isMyTurn()) return

		const history = this.state.history
		const current = history[history.length - 1]
		const squares = current.slice()

		if (squares[i])
			return;
		squares[i] = this.state.blackNext

		//set board state here without setting move list

		App.gameRoom.send({
			move: {
				index: i,
				pass:  false,
			}
		})
	}

	pass() {
		if (!this.isMyTurn()) return
		App.gameRoom.send({
			move: {
				pass: true,
			}
		})
	}

	offer_takeback() {
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

	offer_draw() {
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
			move: step
		});
	}

	sendChat(message) {
		App.gameRoom.send({
			chat: message
		})
	}

	isMyTurn() {
		return ((this.props.color === this.state.blackNext) && !this.props.completed)
	}

	render() {
		if (!this.state.ready) {
			return (<WaitingRoom />)
		} else {
			return (
				<Game {...this.props}
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
					  timer={this.props.game.timer}
					  inc={this.props.game.inc}
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
			<Board squares={current} gameOver={props.completed} onClick={(i) => props.handleClick(i)} size={600}/>
			<Infobox result={props.result}
					 indicator={indicator}
					 moves={moves}
					 moveNum={props.move}
					 jumpTo={(m) => props.jumpTo(m)}
					 resignConfirmation={props.resignConfirmation}
					 pass={() => props.pass()}
					 takeback={() => props.offer_takeback()}
					 draw={() => props.offer_draw()}
					 resign={() => props.resign()}

					 p1={props.p1}
					 p2={props.p2}
					 inc={props.game.inc}

					 messages={props.messages}
					 sendChat={(m) => props.sendChat(m)}
			/>
		</game>
	);
}

class Infobox extends React.Component {

	constructor(props) {
		super(props)
	}

	componentDidUpdate(prevProps) {
		if (this.props.moves.length > prevProps.moves.length) {
			this.moveListDiv.scrollTop = this.moveListDiv.scrollHeight
		}
	}

	componentDidMount() {
		this.moveListDiv.scrollTop = this.moveListDiv.scrollHeight
	}

	render() {
		//temporary
		const indicator = <span className="indicator">    &lt;---</span>
		return (
			<div id="controlBox">
				<Timer timeStart={this.props.p2.timer} increment={this.props.inc}/>
				<PlayerInfo
					player={this.props.p2}
					indicator={!this.props.indicator && !this.props.result && indicator}
				/>
				<div className="control-container">
					<control onClick={() => this.props.jumpTo(1)}> &lt;&lt; </control>
					<control onClick={() => this.props.jumpTo(this.props.moveNum - 1)}> &lt; </control>
					<control onClick={() => this.props.jumpTo(this.props.moveNum + 1)}> &gt; </control>
					<control onClick={() => this.props.jumpTo(this.props.moves.length - 1)}> &gt;&gt; </control>
				</div>
				<div id="moveList" ref={(div => {
					this.moveListDiv = div
				})}>
					<ol>{this.props.moves}</ol>
				</div>
				<div className="control-container">
					<control onClick={() => this.props.pass()}>Pass</control>
					<control style={{textDecoration: 'line-through'}}>Takeback</control>
					<control style={{textDecoration: 'line-through'}}>Draw</control>
					<control
						onClick={() => this.props.resign()}>{this.props.resignConfirmation ? 'Sure?' : 'Resign'}</control>
				</div>
				<PlayerInfo
					player={this.props.p1}
					indicator={this.props.indicator && !this.props.result && indicator}
				/>
				<Timer timeStart={70000} increment={this.props.inc}/>
				<Chat messages={this.props.messages} sendChat={(m) => this.props.sendChat(m)}/>
			</div>
		)
	}
}

function PlayerInfo(props) {
	return (
		<div className="player-name">
			<i className={`circle-${getColor(props.player.color)}`}>&nbsp;</i>
			{props.player.player.display_name}
			{props.indicator}
			{props.rating && <span className="rating"> ({props.rating})</span>}
		</div>
	)

	function getColor(bool) {
		return bool ? 'black' : 'white'
	}
}

class Timer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			time: props.timeStart,
		}
		this.stopTimer = this.stopTimer.bind(this)
		this.startTimer = this.startTimer.bind(this)
	}

	componentDidMount() {
		this.startTimer()
	}

	startTimer() {
		clearInterval(this.timerID)
		this.setState({lastTick: Date.now()})
		this.timerID = setInterval(() => {
			this.tick()
		}, 100)
	}

	stopTimer() {
		clearInterval(this.timerID)
	}

	static formatTime(ms) {
		let minutes = Math.floor((ms % 3600000) / 60000)
		let seconds = (((ms % 360000) % 60000) / 1000)

		if (minutes === 0) {
			seconds = seconds.toFixed(1)
		} else {
			seconds = Math.floor(seconds)
		}
		if (minutes < 10) {
			minutes = `0${minutes}`
		}
		if (seconds < 10) {
			seconds = `0${seconds}`
		}

		return `${minutes}:${seconds}`

	}

	tick() {
		const newTime = this.state.time - (Date.now() - this.state.lastTick)
		if (newTime > 0) {
			this.setState({time: newTime, lastTick: Date.now()})
		} else {
			this.setState({time: 0, lastTick: Date.now()})
			return this.stopTimer()
		}


	}


	render() {
		return (
			<timer className="timer">{Timer.formatTime(this.state.time)}</timer>
		)
	}

}

function Board(props) {
	const squares = props.squares.slice()
	const pieces = squares.map((s, i) => {
		if (s === '' && (props.type === 'small' || props.gameOver))
			return null
		return <Square value={s} index={i} key={i} onClick={() => props.onClick(i)} boardSize={props.size}
		/>

	})
	return (
		<board
			style={{minWidth: `${props.size}px`, minHeight: `${props.size}px`}}>
			{pieces}
		</board>
	);
}

function Square(props) {
	const size = 19; //Dimensions
	const pixels = props.boardSize / 20; //the square width
	const borderSize = props.boardSize / 40; //Width of board borders
	const xmult = props.index % size;
	const ymult = Math.floor(props.index / size);
	const position = {transform: `translate(${pixels * xmult + borderSize}px, ${pixels * ymult + borderSize}px)`}
	const piece = props.value;
	const pixelString = `${pixels}px`;

	let stoneStyle
	if (piece === false) {
		stoneStyle = {
			...position,
			backgroundImage: `url('../images/whitedot.png')`,
			backgroundSize:  pixelString,
			width:           pixelString,
			height:          pixelString,
		}
	} else if (piece === true) {
		stoneStyle = {
			...position,
			backgroundImage: `url('../images/blackdot.png')`,
			backgroundSize:  pixelString,
			width:           pixelString,
			height:          pixelString,
		}
	} else {
		stoneStyle = {
			...position,
			width:  pixelString,
			height: pixelString,
		}
	}

	return (
		<stone key={props.index} style={stoneStyle}
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