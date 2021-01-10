class AddIconColorToEntryTypes < ActiveRecord::Migration[6.1]
  def change
    add_column :entry_types, :icon_color, :string
  end
end
