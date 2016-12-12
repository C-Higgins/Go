class AddPasswordStuffToPlayers < ActiveRecord::Migration[5.0]
  def change
    add_column :players, :password_digest, :string
  end
end
