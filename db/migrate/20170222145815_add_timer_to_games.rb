class AddTimerToGames < ActiveRecord::Migration[5.0]
	def change
		add_column :games, :timer, :integer
		add_column :games, :inc, :integer
	end
end
