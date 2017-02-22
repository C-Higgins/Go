let gv = {};

class Games extends React.Component { //Games is the same variable as 'Games' in the index erb helper
	constructor(props) {
		super(props);
		this.state = {
			games: JSON.parse(this.props.games)  //this games is the @games from the controller
		};
	}

	componentWillMount() {
		gv.callback = (refreshedGames) => { // Comes in from lobby.js.erb
			this.setState({games: refreshedGames})
		}
	}

	render() {
		let games = this.state.games.map((g) => {
			hilite = (this.props.me.id == g.players[0].id) ? {background: '#b3f9f8'} : {};
			return (
				<a className="game" href={'/g/' + g.webid} key={g.webid} style={hilite}>
					<span className="player">{g.players[0].display_name}</span>
					<span className="rating">Unranked</span>
					<span className="time">{`${g.timer / 60}m + ${g.inc}s`}</span>
					<span className="mode">19x19</span>
				</a>
			)
		})
		return (
			<div id="gameListTable">
				<div id="gameListTableHeader">
					<span className="player">Player</span>
					<span className="rating">Rating</span>
					<span className="time">Time</span>
					<span className="mode">Board</span>
				</div>
				<div id="gameListTableRows">
					{games}
				</div>

			</div>);
	}

}