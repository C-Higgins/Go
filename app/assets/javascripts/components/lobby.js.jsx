class Lobby extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			test: '12345'
		};
	}

	buttonClick(type) {
		switch (type) {
			case 'create':
				this.setState({
					test: '67890'
				})
		}
	}

	render() {

		return (
			<div id="lobbywrapper" data-room-id="lobby">
				<div id="shameless-plug">
					<span id="plug-header">rgo</span><br/>
					<span id="plug-body">Chris Higgins<br/><a href="https://github.com/C-Higgins/Go">Github</a></span>
				</div>
				<div id="gameList">
					<Games games={this.props.game_data.games} me={this.props.game_data.me}/>
				</div>
				<div id="button-container">
					<BigButton text={this.props.button_data.create.text} link={this.props.button_data.create.link}
							   remote='true'/>
					<BigButton text={this.props.button_data.friend.text} link={this.props.button_data.friend.link}
							   remote='true' disabled="true"/>
					<BigButton text={this.props.button_data.computer.text} link={this.props.button_data.computer.link}
							   remote='true' disabled="true"/>
				</div>

			</div>)

	}
}
