class BigButton extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			selected: false
		}
	}

	componentDidMount() {
		// Eventually factor this out into the parent page react element
		$('body').on('click', '#modal-close', (e) => {
			this.setState({selected: false})
		})
	}

	handleClick() {
		this.setState({selected: true})
	}

	render() {
		return (
			<div onClick={() => this.handleClick()}
				 className={`game-creation-button ${this.state.selected ? 'selected' : ''} ${this.props.disabled ? 'disabled' : ''}`}>
				{this.props.text}
				<a data-remote={this.props.remote} href={this.props.link}>
					<span></span>
				</a>
			</div>
		);

	}
}