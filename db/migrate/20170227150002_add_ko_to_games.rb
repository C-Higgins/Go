class AddKoToGames < ActiveRecord::Migration[5.0]
	def change
		add_column :games, :ko, :integer, default: nil
	end
end
