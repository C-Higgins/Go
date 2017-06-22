class GamesController < ApplicationController
	include GamesHelper
	include PlayersHelper
	include CableHelper

	def index
		@games = all_pending_games.select(:id, :webid, :timer, :inc).to_json(include: :players)
		@game  = Game.new
	end

	def new
		@game  = Game.new
			# respond_to do |format|
			# 	format.html {
			# 		redirect_to root_path(modal: @modal)
			# 	}
			#
			# end
	end

	def create
		pending_games(@current_user).destroy_all #Remove old pending games
		params[:game][:timer] = params[:game][:timer].to_i*60*1000 #minutes to ms
		params[:game][:inc]   = params[:game][:inc].to_i*1000 #seconds to ms
		@game                 = current_user.games.build(params.require(:game).permit(:timer, :inc, :private))
		@game.history         = [Array.new(361).fill('')]
		@game.messages        = []
		case params[:color]
			when 'white'
				current_user.involvements.last.update(color: false)
			when 'black'
				current_user.involvements.last.update(color: true)
			when 'rand'
				current_user.involvements.last.update(color: !!rand(2))
		end
		current_user.involvements.last.update(timer: params[:game][:timer])
		@game.save
		redirect_to @game if @game.private
		refresh_games_list!

	end

	def show
		@game = Game.find_by(webid: params[:webid]) #these @vars are magically sent to the view

		if @game.players.count >=2
			# Join as spectator
		else
			# Join as player
			unless current_user.nil? || @game.players.include?(@current_user)
				@game.players << current_user
				current_user.involvements.last.update_attributes(color: !@game.involvements.first.color, timer: @game.timer)
				@game.update_attributes(in_progress: true)
				if @game.private
					join(@game, @current_user)
				else
					update_waiters! @game
					refresh_games_list!
				end
			end
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
