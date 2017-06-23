class AddLastMoveToGames < ActiveRecord::Migration[5.0]
	def change
		add_column :games, :last_move, :datetime, default: nil
	end
end
