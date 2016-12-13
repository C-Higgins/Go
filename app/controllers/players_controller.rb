class PlayersController < ApplicationController

	def create
		@player = Player.new(params.require(:player).permit(:name, :email, :password, :password_confirmation))
		if @player.save
			log_in @player
			flash[:success] = "Registration successful"
			redirect_to @player
		else
			render 'new'
		end
	end
	def new
		@player = Player.new
	end
	def show
		@player = Player.find(params[:id])
	end
end
