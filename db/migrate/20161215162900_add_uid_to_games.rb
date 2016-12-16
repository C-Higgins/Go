class AddUidToGames < ActiveRecord::Migration[5.0]
  def change
    add_column :games, :uid, :string
  end
end
