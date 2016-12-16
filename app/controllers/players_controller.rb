class PlayersController < ApplicationController
	before_action :logged_in_user, only: [:edit, :update]
	before_action :logged_out_user, only: [:new, :create]

	# Signup
	def new
		return @player = Player.new unless logged_in?
		redirect_to current_user # if logged in
	end

	# Post signup
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
	
	# Profiles
	def show
		@player = Player.find_by(name: params[:name])
	end

	# Settings
	def edit
		@player = current_user
	end

	# Post settings
	def update
		@player = Player.find(session[:user_id])
		if @player.update_attributes(params.require(:player).permit(:password, :password_confirmation))
			flash[:success] = 'Profile Updated'
			redirect_to @player
		else
			render 'edit'
		end
	end

	private
		def logged_in_user
			unless logged_in?
				save_intent
				flash[:danger] = 'Please log in.'
				redirect_to login_path
			end
		end

		def logged_out_user
			if logged_in?
				redirect_to current_user
			end
		end
end
