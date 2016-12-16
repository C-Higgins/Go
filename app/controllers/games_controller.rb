class GamesController < ApplicationController


	def index
		@games = Game.all #magically goes to the view
	end
	
	def new

	end

	def create
		@game = Game.new(params.require(:game).permit(:name))
		current_user.games << @game
		@game.history = 'THE HISTORY'
		@game.save
		redirect_to @game #redirects to game_path/id which hits routes
	end

	def show
		@game = Game.find_by(webid: params[:webid]) #these @vars are magically sent to the view
		if @game.players.count >=2 	# Join as spectator

		else 						# Join as player
			@game.players << current_user unless @game.players.include? current_user
		end
		@game
	end

	def edit

	end
end
