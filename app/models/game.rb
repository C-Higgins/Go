class Game < ApplicationRecord
	has_many :involvements, inverse_of: :game
	has_many :players, through: :involvements

	before_create :randomize_id
	serialize :history, JSON

	#validates :webid, presence: true, uniqueness: true


	# This makes helpers such as game_path(game) redirect to /g/:webid 
	# instead of the default, /g/:id
	def to_param
		self.webid
	end

	
	private

		# Gives the games/pages a unique identifier such as zJf9ZSrhHQk
		def randomize_id
			begin
			self.webid = SecureRandom.urlsafe_base64(8)
			end while Game.where(webid: self.webid).exists?
		end
end
