class RemoveOldPasswordFields < ActiveRecord::Migration[5.0]
  def change
  	change_table :players do |t|
  		t.remove :encrypted_password
  		t.remove :reset_password_token
  		t.remove :reset_password_sent_at
  	end
  end
end
