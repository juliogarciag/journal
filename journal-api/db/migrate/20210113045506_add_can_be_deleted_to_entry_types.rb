class AddCanBeDeletedToEntryTypes < ActiveRecord::Migration[6.1]
  def change
    add_column :entry_types, :can_be_deleted, :boolean, default: true
  end
end
