class SessionsController < ApplicationController
	def new
	end

	def create
		user = Player.find_by(name: params[:session][:name])
		if user && user.authenticate(params[:session][:password])
			log_in user
			remember user
			redirect_back_or user
		else
			flash.now[:danger] = "Invalid email or password"
			render 'new'
		end
	end

	def destroy
		log_out if logged_in?
		redirect_to root_path
	end
end
