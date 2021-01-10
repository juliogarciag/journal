class AddIconToEntryTypes < ActiveRecord::Migration[6.1]
  def change
    add_column :entry_types, :icon, :string
  end
end
