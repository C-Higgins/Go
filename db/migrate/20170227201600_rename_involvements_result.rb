class RenameInvolvementsResult < ActiveRecord::Migration[5.0]
	def change
		change_table :involvements, :result, :boolean, default: nil
	end
end
