class AddIndexToPlayersEmail < ActiveRecord::Migration[5.0]
  def change
  	add_index :players, :email, unique: true
  	add_index :players, :name, unique: true
  end
end
