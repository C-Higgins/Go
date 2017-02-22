class AddCompletedToGames < ActiveRecord::Migration[5.0]
	def change
		add_column :games, :completed, :boolean, default: false
		add_column :games, :result, :string, default: nil
	end
end
