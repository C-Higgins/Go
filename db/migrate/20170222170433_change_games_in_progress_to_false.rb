class ChangeGamesInProgressToFalse < ActiveRecord::Migration[5.0]
	def change
		change_column_default :games, :in_progress, false
	end
end
