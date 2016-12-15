class ChangeColumnName < ActiveRecord::Migration[5.0]
  def change
  	rename_column :games, :uid, :webid
  end
end
