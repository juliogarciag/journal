class AddSortPositionToEntries < ActiveRecord::Migration[6.1]
  def change
    add_column :entry_types, :row_order, :integer
    add_index :entry_types, :row_order, unique: true
  end
end
