class AddTimerToInvolvements < ActiveRecord::Migration[5.0]
	def change
		add_column :involvements, :timer, :integer
	end
end
