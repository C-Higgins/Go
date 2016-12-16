class Involvement < ApplicationRecord
	belongs_to :game
	belongs_to :player

	validates :game, presence: true
	 validates :player, presence: true
end
