class RenameParticipantsToInvolvements < ActiveRecord::Migration[5.0]
  def change
  	rename_table :participants, :involvements
  end
end
