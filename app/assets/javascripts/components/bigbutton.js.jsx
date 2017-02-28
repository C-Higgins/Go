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
		if (!this.props.disabled)
			this.setState({selected: true})
	}

	render() {
		if (!this.props.disabled) {
			var link = (<a data-remote={this.props.remote} href={this.props.link}>
				<span></span>
			</a>)
		}

		let classes = 'game-creation-button'
		if (this.state.selected) classes += ' selected';
		if (this.props.disabled) classes += ' disabled';

		return (
			<div onClick={() => this.handleClick()}
				 className={classes}>
				{this.props.text}
				{link}
			</div>
		);

	}
}