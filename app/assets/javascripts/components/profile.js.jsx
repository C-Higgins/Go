class Profile extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			activeTab: 0,
		};
	}


	render() {
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
								Wins ({})
							</div>
							<div className="tab">
								Losses ({})
							</div>
							<div className="tab">
								Draws ({})
							</div>
							<div className="tab">
								Ongoing ({})
							</div>

						</div>
					</div>
					<div id="list-block">
						{/*{this.props.games.forEach((g) => {*/}
						{/*return (<a href="link">*/}
						{/*<div className="listing">*/}
						{/*{g.players[0].display_name} vs {g.players[1].display_name}*/}
						{/*</div>*/}
						{/*</a>*/}
						{/*)*/}
						{/*})}*/}
						<div className="listing">No games</div>

					</div>


				</div>
			</div>
		)
	}
}