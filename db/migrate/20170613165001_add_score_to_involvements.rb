class AddScoreToInvolvements < ActiveRecord::Migration[5.0]
	def change
		add_column :involvements, :score, :integer, default: 0
	end
end
