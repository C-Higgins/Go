let gv = {};

class Games extends React.Component { //Games is the same variable as 'Games' in the index erb helper
	constructor(props) {
		super(props);
		//this.state = {
		//	games: JSON.parse(this.props.games)  //this games is the @games from the controller
		//};
	}

	render() {
		let games = this.props.games.map((g) => {
			const classname = this.props.me.id == g.players[0].id ? 'game mine' : 'game'
			const link = g.players.every((p) => {
				return p.id != this.props.me.id
			}) ? '/g/' + g.webid : '#'
			return (
				<a className={classname} href={link} key={g.webid}>
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