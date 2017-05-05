class Chat extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			textareaValue: '',
		}

		this.handleChange = this.handleChange.bind(this)
		this.checkKey = this.checkKey.bind(this)
	}

	handleChange(event) {
		this.setState({textareaValue: event.target.value})
	}

	componentDidUpdate(prevProps) {
		if (this.props.messages.length > prevProps.messages.length) {
			this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight
		}
	}

	componentDidMount() {
		this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight
	}


	checkKey(event) {
		if (event.keyCode !== 13) return;
		event.preventDefault();
		if (event.target.value === '') return;
		this.setState({textareaValue: ''});
		this.props.sendChat(event.target.value);
		console.log(`sending ${event.target.value}`)
	}

	render() {
		const messages = this.props.messages.map((message, i) => {
			return <p key={i}><strong>{message.author}: </strong>{message.message}</p>
		})


		return (
			<div id='chat'>
				<div className="chat-messages" ref={(div => {
					this.messagesDiv = div
				})}>
					{messages}
				</div>
				<textarea value={this.state.textareaValue} onChange={this.handleChange} onKeyDown={this.checkKey}
						  className="chat-input" type="text"
						  placeholder="Chat..."/>

			</div>
		)
	}


}