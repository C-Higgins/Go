class Game < ApplicationRecord
	before_create :randomize_id
	serialize :history, JSON

	#validates :webid, presence: true, uniqueness: true


	# This makes helpers such as game_path(game) redirect to /g/:webid 
	# instead of the default, /g/:id
	def to_param
		self.webid
	end

	
	private

		# Gives the games a unique identifier such as
		# .com/3r8E_fRzzz
		def randomize_id
			begin
			self.webid = SecureRandom.urlsafe_base64(6)
			end while Game.where(webid: self.webid).exists?
		end
end
