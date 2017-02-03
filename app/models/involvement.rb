class Involvement < ApplicationRecord
	belongs_to :game, inverse_of: :involvements
	belongs_to :player, inverse_of: :involvements

	validates :game, presence: true
	 validates :player, presence: true
end
