class GamesController < ApplicationController
	include GamesHelper
	include PlayersHelper
	include CableHelper

	def index
		@games = all_pending_games.select(:id, :webid, :timer, :inc).to_json(include: :players)
		@game  = Game.new
	end

	def new
		@modal = 0
		@game  = Game.new
		respond_to do |format|
			format.html {
				redirect_to root_path(modal: @modal)
			}

		end
	end

	def create
		pending_games(@current_user).destroy_all #Remove old pending games
		params[:game][:timer] = params[:game][:timer].to_i*60 #minutes to seconds
		@game                 = current_user.games.build(params.require(:game).permit(:timer, :inc))
		@game.history = [Array.new(361).fill('')]
		case params[:color]
			when 'white'
				current_user.involvements.last.update(color: false)
			when 'black'
				current_user.involvements.last.update(color: true)
			when 'rand'
				current_user.involvements.last.update(color: !!rand(2))
		end
		@game.save
		refresh_games_list!
		@game
	end

	def show
		@game = Game.find_by(webid: params[:webid]) #these @vars are magically sent to the view
		return if (@game.players.include?(@current_user) && @game.players.count < 2)

		if @game.players.count >=2
			# Join as spectator
		else
			# Join as player
			unless current_user.nil?
				@game.players << current_user
				current_user.involvements.last.update(color: !@game.involvements.first.color)
				@game.update(in_progress: true)
				@game.save
				update_waiters! @game
				refresh_games_list!
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
