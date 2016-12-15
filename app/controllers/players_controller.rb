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
		@player = Player.find_by(name: params[:name])
	end

	def edit
		@player = Player.find(session[:user_id])
	end

	def update
		@player = Player.find(session[:user_id])
		if @player.update_attributes(params.require(:player).permit(:password, :password_confirmation))
			flash[:success] = 'Profile Updated'
			redirect_to @player
		else
			render 'edit'
		end
	end
end
