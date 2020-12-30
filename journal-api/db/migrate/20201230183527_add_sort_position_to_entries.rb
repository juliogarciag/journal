class AddSortPositionToEntries < ActiveRecord::Migration[6.1]
  def change
    add_column :entry_types, :sort_position, :integer
    add_index :entry_types, :sort_position, unique: true
  end
end
