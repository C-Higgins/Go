class GamesController < ApplicationController


	def index
		@games = Game.joins(:players).group('id').having('count(players.id)<2').to_json(include: :players) #magically goes to the view
		@game  = Game.new
	end

	def new
		@modal = 'new'
		@game  = Game.new
		respond_to do |format|
			format.js { render template: 'layouts/modal', locals: {modal: @modal} } #modal.js
			format.html {
				redirect_to root_path(modal: @modal)
			}

		end
	end

	def create
		@game         = current_user.games.build
		@game.history = [Array.new(361).fill('')]
		current_user.involvements.last.update(color: true) #1 black, 0 white
		@game.save

		ActionCable.server.broadcast 'lobby', Game.joins(:players).group('id').having('count(players.id)<2').to_json(include: :players)
		# ActionCable.server.broadcast 'waiting', @game.players.first.name
		@game
		#need to add white and black IDs when chosen
	end

	def show
		@game = Game.find_by(webid: params[:webid]) #these @vars are magically sent to the view
		if @game.players.count >=2
			# Join as spectator
		else
			# Join as player
			unless @game.players.include?(current_user) || current_user.nil?
				@game.players << current_user
				current_user.involvements.last.update(color: false)
				@game.save
				ActionCable.server.broadcast 'lobby', Game.joins(:players).group('id').having('count(players.id)<2').to_json(include: :players)
				ActionCable.server.broadcast 'waiting', {p1: @game.players.first.name, p2: @game.players.second.name, id: @game.webid}
			end

			# Change this part when anon users implemented
		end
		@game
	end

	def edit
		# @history = params
	end

	def update
		# @game = Game.find_by(webid: params[:webid])
		# history = params[:_json]
		# # validate history
		# @game.update_attributes(history: history)
		# if @game.save
		# 	ActionCable.server.broadcast 'game_channel',
		# 								 message: 'hi im a message',
		# 								 user: @game.players.first
		# 	head :ok
		# 	render json: @game.history
		# end

	end
end
