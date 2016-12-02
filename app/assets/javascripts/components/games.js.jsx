class Games extends React.Component { //Games is the same variable as 'Games' in the index erb helper
	constructor(props) {
		super(props);
		this.state = {
			games: this.props.data  //this games is the @games from the controller
		};
	}



	render() {
		console.log(this.state)
		let games = this.state.games.map((g) => {
			return (
				<li key={g.id}>
				<a href={'/g/'+ g.id}>{g.name}</a>
				</li>
			)
		})
		return (
			<div className="games">
				<h2 className="name"> Games </h2>
				{games}
			</div>
		);
	}

}