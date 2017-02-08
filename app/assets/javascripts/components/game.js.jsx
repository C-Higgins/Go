let gv = {};

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = { //initial
            history: props.game.history,
            blackNext: props.game.history.length % 2 != 0,
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
        //there is a bug here where it will concat the history and then again when it gets the socket response
        // So you will see two moves in your history for the same move

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
            <game>
                <Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
                <Infobox status={status} moves={moves} moveNum={this.state.move} jumpTo={(m) => this.jumpTo(m)}/>
            </game>
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
                    <control onClick={() => this.props.jumpTo(this.props.moveNum - 1)}> &lt; </control>
                    <control onClick={() => this.props.jumpTo(this.props.moveNum + 1)}> &gt; </control>
                    <control onClick={() => this.props.jumpTo(this.props.moves.length - 1)}> &gt;&gt; </control>
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
        if (piece == 'WHITE') {
            return {
                ...position,
                backgroundImage: `url('../images/whitedot.png')`
            }
        } else if (piece == 'BLACK') {
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
