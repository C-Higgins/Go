module SessionsHelper

	def redirect_back_or default
		redirect_to (session[:intended_url] || default)
		session.delete(:intended_url)
	end

	def save_intent
		session[:intended_url] = request.original_url if request.get?
	end

	def log_in user
		session[:user_id] = user.id
	end

	def remember user
		user.remember
		cookies.permanent.signed[:user_id] = user.id
		cookies.permanent[:remember_token] = user.remember_token
	end

	def forget user
		user.forget
		cookies.delete(:user_id)
		cookies.delete(:remember_token)
	end

	def current_user
		if (user_id = session[:user_id])
			@current_user ||= Player.find_by(id: user_id)
		elsif (user_id = cookies.signed[:user_id])
			user = Player.find_by(id: user_id)
			if user && user.authenticated?(cookies[:remember_token])
				log_in(user)
				@current_user = user
			end
		else
			anon = Player.new(name: SecureRandom.urlsafe_base64(10), password: '123456', password_confirmation: '123456', anonymous: true, display_name: 'Anonymous')
			anon.save(validate: false) if anon.new_record?
			@current_user = anon
			log_in anon
			remember anon

		end
	end

	def logged_in?
		return (!current_user.nil? && !anon?)
	end

	def anon?
		return current_user.anonymous
	end

	def log_out
		forget(current_user)
		session.delete(:user_id)
		@current_user = nil
	end
end
