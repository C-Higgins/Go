class UpdatePlayers < ActiveRecord::Migration[5.0]
	def change
		remove_column :players, :email
		add_column :players, :anonymous, :boolean, default: false
	end
end
