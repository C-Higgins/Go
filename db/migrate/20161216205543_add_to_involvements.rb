class AddToInvolvements < ActiveRecord::Migration[5.0]
  def change
  	add_column :involvements, :color, :boolean
  	add_column :involvements, :result, :string
  end
end
