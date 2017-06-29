function Games(props) {
	let games = props.games.map((g) => {
		const myGame = props.me.id === g.involvements[0].player.id
		const classname = myGame ? 'game mine' : 'game'
		const link = g.involvements.every((i) => {
			return i.player.id !== props.me.id
		}) ? '/g/' + g.webid : '#'
		return (
			<a className={classname} href={link} key={g.webid}>
					<span className="player">
						<i className={`circle-${getColor(g.involvements[0].color)}`}>&nbsp;</i>
						{g.involvements[0].player.display_name}
					</span>
				<span className="rating">Unranked</span>
				<span className="time">{`${g.timer / 60000}m + ${g.inc / 1000}s`}</span>
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

		</div>
	);
}