class AddEntriesCountToEntryTypes < ActiveRecord::Migration[6.1]
  def change
    add_column :entry_types, :entries_count, :integer, default: 0, null: false
  end
end
