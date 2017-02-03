class AddDefaultValueToInProgress < ActiveRecord::Migration[5.0]
	def up
		change_column :games, :in_progress, :boolean, :default => true
	end

	def down
		change_column :games, :in_progress, :boolean, :default => nil
	end
end
