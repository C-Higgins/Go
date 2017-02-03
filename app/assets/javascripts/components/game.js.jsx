let gv = {};

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = { //initial
            history: props.game.history,
            blackNext: props.game.history.length % 2 == 0,
            move: props.game.history.length - 1
        }

    }

    componentWillMount() {
        gv.callback = (data, id) => { // Comes in from gameroom.js.erb
            if (id == this.props.game.webid) {
                this.setState({
                    history: this.state.history.concat(data),
                    move: this.state.move + 1,
                    blackNext: !this.state.blackNext
                })
            }
            console.log(data)
        }
    }

    handleClick(i) {
        console.log('handling a click')
        if (this.props.color != this.state.blackNext) {
            return;
        }
        const history = this.state.history
        const current = history[history.length - 1]
        const squares = current.squares.slice()

        if (squares[i] || calculateWinner(squares))
            return;
        this.state.blackNext ? squares[i] = 'BLACK' : squares[i] = 'WHITE'
        this.setState({
            move: history.length,
            history: history.concat([{
                squares: squares
            }])
        });


        App.gameRoom.send({
            newMove: {squares: squares},
            webid: this.props.game.webid
        })
        // -> gameroom_channel#receive


        /* Send state through websocket here to update server and other client
         Other client would be like websocket.onrecieve(data, (data)=>setstate(data))
         And server has to save it to the db
         */
    }

    jumpTo(step) {
        if ((step >= this.state.history.length) || step < 0) return;
        this.setState({
            move: step,
            xIsNext: (!(step % 2)),
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
                    <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
                </li>
            );
        });

        let status
        if (winner)
            status = `Winner: ${winner}`
        else
            status = `${this.props.color == this.state.blackNext ? 'YOUR MOVE' : 'THEIR MOVE'}`;
        return (
            <div className="game">
                <Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
                <Infobox status={status} moves={moves} moveNum={this.state.move} jumpTo={(m) => this.jumpTo(m)}/>
            </div>
        );
    }
}

class Infobox extends React.Component {
    render() {
        return (
            <div id="controlBox">
                <span>{ this.props.status }</span>
                <div id="moveList">
                    <ol>{this.props.moves}</ol>
                </div>
                <div id="controlButtons">
                    <a href='#' onClick={() => this.props.jumpTo(this.props.moveNum - 1)}> &lt; </a>
                    <a href='#' onClick={() => this.props.jumpTo(this.props.moveNum + 1)}> &gt; </a>
                    <a href='#' onClick={() => this.props.jumpTo(this.props.moves.length - 1)}> &gt;&gt; </a>
                </div>
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
            <div id='board'>
                {pieces}
            </div>
        );
    }
}

class Square extends React.Component {
    calcStyle() {
        const size = 19
        const pixels = 26 //the square width
        const xmult = this.props.index % size
        const ymult = Math.floor(this.props.index / size)
        let piece = this.props.value
        if (piece == 'WHITE') {
            return {
                transform: `translate(${pixels * xmult + 3}px, ${pixels * ymult + 3}px)`,
                backgroundImage: `url('../images/whitedot.png')`,
                backgroundSize: 'contain'
            }
        } else if (piece == 'BLACK') {
            return {
                transform: `translate(${pixels * xmult + 3}px, ${pixels * ymult + 3}px)`,
                backgroundImage: `url('../images/blackdot.gif')`,
                backgroundSize: 'contain'
            }
        } else {
            return {transform: `translate(${pixels * xmult + 3}px, ${pixels * ymult + 3}px)`}
        }
    }

    render() {
        return (
            <stone className='stone' key={this.props.index} style={this.calcStyle()}
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
