class AddPrivateToGames < ActiveRecord::Migration[5.0]
	def change
		add_column :games, :private, :boolean, default: false
	end
end
