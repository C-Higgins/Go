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
		this.lobbySubscribe(this.props.game_data.me.id)
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

	createGame(user) {
		setTimeout(() => {
			if (!App.cable.subscriptions.subscriptions.find((s) => {
					return JSON.parse(s.identifier).channel == 'WaitingChannel'
				}))
				this.waitSubscribe(user);
			this.setState({show_modal: null})
		}, 0)
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
				<Modal authenticity_token={this.props.auth}
					   games={this.props.game_data.games_in_progress}
					   type={this.state.show_modal}
					   createGame={() => this.createGame(this.props.game_data.me.id)}
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


	waitSubscribe(user) {
		const lobby = this
		App.waiting = App.cable.subscriptions.create({channel: "WaitingChannel", room: 'waiting', user: user}, {
			connected: function () {
				// Called when the subscription is ready for use on the server
				console.log('joined waiting channel')
			},

			disconnected: function () {
				// Called when the subscription has been terminated by the server
				console.log('left lobby')
			},

			received: function (data) {
				const id = lobby.props.game_data.me.id
				if (id == data.p1 || id == data.p2) {
					this.unsubscribe();
					window.location = '/g/' + data.id
				}

			}
		})
		return App.cable.subscriptions.subscriptions[App.cable.subscriptions.subscriptions.length - 1]
	};

	lobbySubscribe(user) {
		const lobby = this
		if (wrapper = document.getElementById('lobbywrapper')) {
			App.lobby = App.cable.subscriptions.create({channel: "LobbyChannel", room: 'lobby', user: user}, {
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
					lobby.router(JSON.parse(games));
				}
			})
		}
		return App.cable.subscriptions.subscriptions[App.cable.subscriptions.subscriptions.length - 1]
	}

	unsubscribe(channelname) {
		App.cable.subscriptions.subscriptions.find((s) => {
			return JSON.parse(s.identifier).channel == channelname;
		}).unsubscribe();
	}

}
