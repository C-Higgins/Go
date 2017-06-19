class Profile extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			activeTab: 0,
			table:     {
				All:      [],
				Wins:     [],
				Losses:   [],
				Draws:    [],
				Ongoings: [],
			},
			gamesList: []
		};
	}

	componentDidMount() {
		let w = []
		let l = []
		let d = []
		let o = []
		const allGames = this.props.games.reverse()
		allGames.forEach(g => {
			if (g.game.in_progress === true) o.push(g)
			if (g.draw === true) return d.push(g)
			if (g.winner === true) return w.push(g)
			if (g.winner === false) return l.push(g)
		})

		this.setState({table: {All: allGames, Wins: w, Losses: l, Draws: d, Ongoings: o}, gamesList: allGames})
	}

	changeTab(i) {
		this.setState({
			activeTab: i,
			gamesList: this.state.table[Object.keys(this.state.table)[i]]
		})
	}


	render() {
		const TAB_TEXT = Object.keys(this.state.table).map((k) => {
			return `${k}: (${this.state.table[k].length})`
		})
		const tabs = TAB_TEXT.map((s, i) => {
			const active = i === this.state.activeTab ? 'tab active' : 'tab'
			return <div className={active} key={i}
						onClick={() => this.changeTab(i)}>{s}</div>
		})


		return (
			<div id="wrapper">
				<div id="side-header-container">
					<span id="plug-header">{this.props.playerName}</span>
				</div>
				<div id="game-history-container">
					<div id="header-block">
						<div id="tabs">
							{tabs}
						</div>
					</div>
					<GameList games={this.state.gamesList}/>


				</div>
			</div>
		)
	}
}

function GameList(props) {
	let resultClass;
	const games = props.games.map((g) => {
		if (g.winner === true) {
			resultClass = 'win'
		} else if (g.winner === false && g.draw !== true) {
			resultClass = 'loss'
		} else {
			resultClass = ''
		}

		date = (new Date(g.game.created_at)).toDateString()

		return (<a href={"/g/" + g.game.webid} key={g.game.webid}>
				<div className={'listing ' + resultClass}>
					<Board squares={g.game.history[g.game.history.length - 1]}
						   size={130 /*This is .listing height-20*/}
						   type="small"
					/>
					<div className="game-info">
						<span className="date">{date}</span>
						<div className="left col-2">{g.game.players[0].display_name}</div>
						<span className="vs">vs</span>
						<div className="right col-2">{g.game.players[1].display_name}</div>
						<div className="bottom"><span>{g.game.result}</span></div>

					</div>
				</div>
			</a>
		)
	})
	return (
		<div id="list-block">
			{!!games.length ? games : 'None found'}
		</div>
	)
}