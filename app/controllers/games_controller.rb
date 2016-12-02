class GamesController < ApplicationController


	def index
		@games = Game.all #magically goes to the view
	end
	def new

	end

	def create
		@game = Game.new(params.require(:game).permit(:name))
		@game.save
		redirect_to @game #redirects to game_path/id which hits routes
	end

	def show
		@game = Game.find(params[:id]) #these @vars are magically sent to the view
	end
end
