class Lobby extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			games:   JSON.parse(props.game_data.games),
			modal:   props.modal,
			buttons: props.button_data,
		};
		PRIVATE_MSG = "You will be given a URL to share with a friend."
		PUBLIC_MSG = "Your game will be shown in the game list until someone joins it."
	}

	componentDidMount() {
		this.lobbySubscribe(this.props.game_data.me.id)
	}

	router(refreshedGames) {
		this.setState({games: refreshedGames})
	}

	close_modal() {
		const buttons = this.state.buttons.map((b) => {
			b.selected = false;
			return b;
		});
		this.setState({
			modal:   this.props.modals.none,
			buttons: buttons,
		});
		history.replaceState(null, null, '/');
	}

	open_modal(which) {
		let buttons = this.state.buttons.slice();
		buttons[which].selected = true;
		this.setState({
			modal:   which,
			buttons: buttons,
		})
	}

	createGame(user) {
		setTimeout(() => {
			if (!App.cable.subscriptions.subscriptions.find((s) => {
					return JSON.parse(s.identifier).channel == 'WaitingChannel'
				})) {
				this.waitSubscribe(user);
			}
			this.setState({modal: this.props.modals.none})
		}, 0)
	}

	render() {
		const buttons = this.state.buttons.map((b, i) => {
			return <BigButton text={b.text}
							  disabled={b.disabled}
							  selected={i == this.state.modal}
							  onClick={() => b.disabled ? null : this.open_modal(i)}
							  key={i}
			/>
		});
		if (this.state.modal === 0) {
			var text = PUBLIC_MSG
		} else if (this.state.modal === 1) {
			text = PRIVATE_MSG
		}
		return (
			<div id="wrapper" data-room-id="lobby">
				{this.state.modal !== -1 &&
				<Modal authenticity_token={this.props.auth}
					   private={this.state.modal === this.props.modals.private}
					   games_in_progress={this.props.game_data.games_in_progress}
					   createGame={() => this.createGame(this.props.game_data.me.id)}
					   close_modal={() => this.close_modal()}
					   messaging={text}/>
				}
				<div id="shameless-plug">
					<span id="plug-header">rgo</span><br />
					<span id="plug-body"><a href="https://github.com/C-Higgins/Go">a Go server</a></span>
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
		App.waiting = App.cable.subscriptions.create({channel: 'WaitingChannel', room: 'waiting', user: user}, {
			connected: () => {
				// Called when the subscription is ready for use on the server
				console.log('joined waiting channel')
			},

			disconnected: () => {
				// Called when the subscription has been terminated by the server
				console.log('left lobby')
			},

			received: data => {
				const id = this.props.game_data.me.id;
				if (id == data.p1 || id == data.p2) {
					App.waiting.unsubscribe();
					window.location = '/g/' + data.id
				}

			},
		});
		return App.cable.subscriptions.subscriptions[App.cable.subscriptions.subscriptions.length - 1]
	};

	lobbySubscribe(user) {
		let wrapper = document.getElementById('wrapper');
		if (wrapper) {
			App.lobby = App.cable.subscriptions.create({channel: 'LobbyChannel', room: 'lobby', user: user}, {
				connected: () => {
					// Called when the subscription is ready for use on the server
					console.log('connected to lobby');
				},

				disconnected: () => {
					// Called when the subscription has been terminated by the server
					console.log('left lobby')
				},

				received: games => {
					console.log('websocket data recieved in lobby');
					this.router(JSON.parse(games));
				},
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
