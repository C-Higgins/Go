class Profile extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			activeTab: 0,
		};
	}


	render() {
		let wins = []
		let losses = []
		let draws = []
		let ongoings = []
		this.props.games.forEach(g => {
			if (g.game.in_progress === true) ongoings.push(g)
			if (g.draw === true) return draws.push(g)
			if (g.winner === true) return wins.push(g)
			if (g.winner === false) return losses.push(g)
		})

		let resultColor
		return (
			<div id="wrapper">
				<div id="side-header-container">
					<span id="plug-header">{this.props.playerName}</span>
				</div>
				<div id="game-history-container">
					<div id="header-block">
						<div id="headings">
							<span className="heading"></span>
							<span className="heading">Header</span>
							<span className="heading"></span>
						</div>
						<div id="tabs">
							<div className="tab active">
								All ({this.props.games.length})
							</div>
							<div className="tab">
								Wins ({wins.length})
							</div>
							<div className="tab">
								Losses ({losses.length})
							</div>
							<div className="tab">
								Draws ({draws.length})
							</div>
							<div className="tab">
								Ongoing ({ongoings.length})
							</div>

						</div>
					</div>
					<div id="list-block">
						{this.props.games.reverse().map((g) => {
							if (g.winner === true) {
								resultColor = 'green'
							} else if (g.winner === false && g.draw === false) {
								resultColor = 'red'
							} else {
								resultColor = ''
							}

							return (<a href={"http://localhost:3000/g/" + g.game.webid}>
									<div className="listing">
										<div className="game-info">
											{g.game.players[0].display_name} vs {g.game.players[1].display_name}
											<br/>
											<span style={{color: resultColor}}>{g.game.result}</span>
										</div>
										<Board squares={g.game.history[g.game.history.length - 1]}
											   size={130 /*This is .listing height-20*/}
											   type="small"
										/>
									</div>
								</a>
							)
						})}
						<div className="listing">No games</div>

					</div>


				</div>
			</div>
		)
	}
}