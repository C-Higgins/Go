module ApplicationCable
	class Connection < ActionCable::Connection::Base

		identified_by :user

		def connect
			self.user = user
		end


		def session
			cookies.encrypted[Rails.application.config.session_options[:key]]
		end

		def user
			Player.find_by(id: session['user_id'])
		end
	end
end
