class Lobby extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			test:  '12345',
			games: JSON.parse(props.game_data.games),
			modal: props.button_data.modaltest
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

	buttonClick(type) {
		switch (type) {
			case 'create':
				this.setState({
					test: '67890'
				})
		}
	}

	//modal() {
	//	this.setState({modal: this.props.button_data.modaltest})
	//}

	render() {

		return (
			<div id="lobbywrapper" data-room-id="lobby">
				{this.state.modal}
				<div id="shameless-plug">
					<span id="plug-header">rgo</span><br/>
					<span id="plug-body">Chris Higgins<br/><a href="https://github.com/C-Higgins/Go">Github</a></span>
				</div>
				<div id="gameList">
					<Games games={this.state.games} me={this.props.game_data.me}/>
				</div>
				<div id="button-container">
					<BigButton text={this.props.button_data.create.text} link={this.props.button_data.create.link}
							   remote='true'/>
					<BigButton text={this.props.button_data.friend.text} link={this.props.button_data.friend.link}
							   remote='true' disabled="true"/>
					<BigButton text={this.props.button_data.computer.text} link={this.props.button_data.computer.link}
							   remote='true'/>
				</div>

			</div>)

	}
}
