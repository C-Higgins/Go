class AddDisplaynameToPlayers < ActiveRecord::Migration[5.0]
	def change
		add_column :players, :display_name, :string
	end
end
