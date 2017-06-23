class Timer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			time: props.timeStart,
			done: false,
		}
		this.stopTimer = this.stopTimer.bind(this)
		this.startTimer = this.startTimer.bind(this)
	}

	componentDidMount() {
		this.props.ticking && this.startTimer()
	}

	componentWillUnmount() {
		this.stopTimer()
	}

	componentWillReceiveProps(np) {
		this.setState({time: np.timeStart})
		if (!np.ticking && this.props.ticking) {
			this.stopTimer()
		} else if (np.ticking && !this.props.ticking) {
			this.startTimer()
		}
	}

	shouldComponentUpdate(np, ns) {
		if (np.ticking && this.props.ticking && ns.time > this.state.time) {
			return false
		}
		return !this.state.done
		return true
	}

	startTimer() {
		clearInterval(this.timerID)
		this.setState({startedAt: Date.now()})
		this.timerID = setInterval(() => {
			this.tick()
		}, 100)
	}

	stopTimer() {
		clearInterval(this.timerID)
	}

	tick() {
		const newTime = this.props.timeStart - (Date.now() - this.state.startedAt)
		if (newTime > 0) {
			this.setState({time: newTime})
		} else {
			this.stopTimer()
			this.setState({time: 0, done: true})
			this.props.timeUp()
		}
	}

	static formatTime(ms) {
		let minutes = Math.floor((ms % 3600000) / 60000)
		let seconds = (((ms % 360000) % 60000) / 1000)

		if (minutes === 0) {
			seconds = seconds.toFixed(1)
		} else {
			seconds = Math.floor(seconds)
		}
		if (minutes < 10) {
			minutes = `0${minutes}`
		}
		if (seconds < 10) {
			seconds = `0${seconds}`
		}

		return `${minutes}:${seconds}`

	}

	render() {
		const low = this.state.time < 60000 ? ' low' : ''
		return (
			<timer className={'timer' + low}>{Timer.formatTime(this.state.time)}</timer>
		)
	}

}