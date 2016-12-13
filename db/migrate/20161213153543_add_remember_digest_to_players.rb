class AddRememberDigestToPlayers < ActiveRecord::Migration[5.0]
  def change
    add_column :players, :remember_digest, :string
  end
end
