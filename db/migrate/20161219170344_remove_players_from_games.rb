class RemovePlayersFromGames < ActiveRecord::Migration[5.0]
  def change
	  change_table :games do |t|
		  t.remove :white_pid
		  t.remove :black_pid
		  t.remove :winning_pid
	  end
  end
end
