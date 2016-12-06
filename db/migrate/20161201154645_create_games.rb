class CreateGames < ActiveRecord::Migration[5.0]
  def change
    create_table :games do |t|
      t.string :name
      t.integer :white_pid
      t.integer :black_pid
      t.integer :winning_pid
      t.boolean :in_progress

      t.text :history
      t.integer :move
      
      t.timestamps
    end
  end
end