let gv = {};

class Game extends React.Component {
	constructor(props){
		super(props);
		this.state = { //initial
			history: props.game.history,
			xNext: props.game.history.length % 2 == 0,
			move: props.game.history.length-1
		}

	}

	componentWillMount(){
        gv.callback = (data, id) => { // Comes in from gameroom.js.erb
            if (id == this.props.game.webid){
                this.setState({history: data, move: data.length-1})
            }
            console.log(data)
        }
	}
	handleClick(i){
		console.log('handling a click')
		const history = this.state.history
		const current = history[history.length-1]
		const squares = current.squares.slice()

		if (squares[i] || calculateWinner(squares)) 
			return;
		//this.setState({})
		this.state.xNext ? squares[i] = 'X' : squares[i] = 'O'
		this.setState({
            move: history.length,
		    history: history.concat([{
		      squares: squares
		    }]),
		    xNext: !this.state.xNext,
		  });
        let _this = this;


        App.gameRoom.send({
            data: history.concat([{squares: squares}]),
            webid: this.props.game.webid
        })
        // -> gameroom_channel#receive


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
				<Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
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
			return <Square value = {s} index={i} key={i} onClick={() => this.props.onClick(i)} />
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
		const size = 3
		const pixels = 75 //the square width
		const xmult = this.props.index % size
		const ymult = Math.floor(this.props.index / size)

		return {
			transform: `translate(${pixels*xmult}px, ${pixels*ymult}px)`
		}
	}
	render() {
		return (
			<stone className='stone' key={this.props.index} style = {this.calcStyle()} onClick={()=>this.props.onClick()}>
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
