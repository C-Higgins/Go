module ApplicationCable
	class Channel < ActionCable::Channel::Base
		delegate :session, to: :connection
		protected :session
	end
end
