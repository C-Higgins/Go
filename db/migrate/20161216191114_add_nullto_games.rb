class AddNulltoGames < ActiveRecord::Migration[5.0]
  def change
  	change_column :games, :move, :integer, null: false, default: 0
  	change_column :games, :webid, :string, null:false
  end
end
