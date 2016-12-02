class CreateGames < ActiveRecord::Migration[5.0]
  def change
    create_table :games do |t|
      t.string :name
      t.integer :white_pid
      t.integer :black_pid
      t.integer :turn
      t.integer :winning_pid
      
      t.timestamps
    end
  end
end
