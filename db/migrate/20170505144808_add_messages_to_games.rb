class AddMessagesToGames < ActiveRecord::Migration[5.0]
	def change
		add_column :games, :messages, :text
	end
end
