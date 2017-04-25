class Modal extends React.Component {
	constructor(props) {
		super(props);
		this.state = { //initial
		}
	}

	componentDidMount() {
		$('input[type="range"].rangeslider-minutes').rangeslider({

			// Feature detection the default is `true`.
			// Set this to `false` if you want to use
			// the polyfill also in Browsers which support
			// the native <input type="range"> element.
			polyfill: false,

			// Default CSS classes
			rangeClass:      'rangeslider',
			disabledClass:   'rangeslider--disabled',
			horizontalClass: 'rangeslider--horizontal',
			verticalClass:   'rangeslider--vertical',
			fillClass:       'rangeslider__fill',
			handleClass:     'rangeslider__handle',

			// Callback function
			onInit: function () {
				this.output = $('<div class="range-output" />').insertAfter(this.$range).html(`Timer: ${this.$element.val()}m`);
			},

			// Callback function
			onSlide: function (position, value) {
				this.output.html(`Timer: ${value}m`);
			},

			// Callback function
			onSlideEnd: function (position, value) {
			}
		});
		$('input[type="range"].rangeslider-seconds').rangeslider({

			// Feature detection the default is `true`.
			// Set this to `false` if you want to use
			// the polyfill also in Browsers which support
			// the native <input type="range"> element.
			polyfill: false,

			// Default CSS classes
			rangeClass:      'rangeslider',
			disabledClass:   'rangeslider--disabled',
			horizontalClass: 'rangeslider--horizontal',
			verticalClass:   'rangeslider--vertical',
			fillClass:       'rangeslider__fill',
			handleClass:     'rangeslider__handle',

			// Callback function
			onInit: function () {
				this.output = $('<div class="range-output" />').insertAfter(this.$range).html(`Increment: +${this.$element.val()}s`);
			},

			// Callback function
			onSlide: function (position, value) {
				this.output.html(`Increment: +${value}s`);
			},

			// Callback function
			onSlideEnd: function (position, value) {
			}
		});
	}

	render() {
		return (
			<div id='modal'>
				<div id='modalContainer'>
					<span id="modal-close" onClick={() => this.props.close_modal(this.props.type)}>
						X
					</span>
					<div id="modalBody">
						{!!this.props.games.length &&
						'Note: You have games in progress. Creating a new game will not interrupt ongoing games.'
						}

						<form id="new_game" onSubmit={() => this.props.createGame()} action="/g" acceptCharset="UTF-8"
							  method="post">
							<input name="utf8" type="hidden" value="✓"/>
							<input type='hidden' name='authenticity_token' value={this.props.authenticity_token}/>

							<input step="1" defaultValue="10" className="rangeslider-minutes" min="1" max="120"
								   type="range"
								   name="game[timer]" id="game_timer"
							/>
							<input step="5" defaultValue="5" className="rangeslider-seconds" min="0" max="30"
								   type="range"
								   name="game[inc]" id="game_inc"
							/>

							<button name="color" type="submit" value="black" id="submit-black">Black</button>
							<button name="color" type="submit" value="rand" id="submit-rand">Rand</button>
							<button name="color" type="submit" value="white" id="submit-white">White</button>
						</form>
					</div>
				</div>
			</div>
		)
	}
}


