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
		console.log(this.state)
		let games = this.state.games.map((g) => {
			return (
				<li key={g.webid}>
                    <a href={'/g/' + g.webid}>{g.players[0].name}</a>
				</li>
			)
		})
		return (
			<div className="games">
                <h2 className="name"> Open Games </h2>
				{games}
			</div>
		);
	}

}