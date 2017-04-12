class BigButton extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			selected: false
		}
	}

	componentDidMount() {
		$('body').bind("DOMNodeRemoved", (e) => {
			if (e.target.id == 'modal')
				this.setState({selected: false})
		});
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