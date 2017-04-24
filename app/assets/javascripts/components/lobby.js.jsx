class Lobby extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			games:      JSON.parse(props.game_data.games),
			show_modal: props.show_modal,
			buttons:    props.button_data
		};
	}

	componentDidMount() {
		const react = this
		if (wrapper = document.getElementById('lobbywrapper')) {
			App.lobby = App.cable.subscriptions.create({channel: "LobbyChannel", room: 'lobby'}, {
				connected: function () {
					// Called when the subscription is ready for use on the server
					console.log('connected to lobby')
					$(document).on('page:change', function () {
						this.unsubscribe();
					})
				},

				disconnected: function () {
					// Called when the subscription has been terminated by the server
					console.log('left lobby')
				},

				received: function (games) {
					console.log('websocket data recieved in lobby');
					react.router(JSON.parse(games));
				}
			})
		}
	}

	router(refreshedGames) {
		this.setState({games: refreshedGames})
	}

	close_modal(which) {
		let buttons = this.state.buttons.slice()
		buttons[which].selected = false
		this.setState({
			show_modal: null,
			buttons:    buttons
		})
		history.replaceState(null, null, '/');
	}

	open_modal(which) {
		let buttons = this.state.buttons.slice()
		buttons[which].selected = true
		this.setState({
			show_modal: which,
			buttons:    buttons
		})
	}

	render() {
		const buttons = this.state.buttons.map((b, i) => {
			return <BigButton text={b.text}
							  disabled={b.disabled}
							  selected={i == this.state.show_modal}
							  onClick={() => this.open_modal(i)}
							  key={i}
			/>
		})
		return (
			<div id="lobbywrapper" data-room-id="lobby">
				{this.state.show_modal !== null &&
				<Modal authenticity_token={this.props.auth} id={this.props.game_data.me.id} type={this.state.show_modal}
					   close_modal={(which) => this.close_modal(which)}/>
				}
				<div id="shameless-plug">
					<span id="plug-header">rgo</span><br/>
					<span id="plug-body">Chris Higgins<br/><a href="https://github.com/C-Higgins/Go">Github</a></span>
				</div>
				<div id="gameList">
					<Games games={this.state.games} me={this.props.game_data.me}/>
				</div>
				<div id="button-container">
					{buttons}
				</div>

			</div>)

	}
}
