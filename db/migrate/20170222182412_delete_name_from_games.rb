class DeleteNameFromGames < ActiveRecord::Migration[5.0]
	def change
		remove_column :games, :name
	end
end
