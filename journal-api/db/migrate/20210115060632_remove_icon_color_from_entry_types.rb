class RemoveIconColorFromEntryTypes < ActiveRecord::Migration[6.1]
  def change
    remove_column :entry_types, :icon_color, :string
  end
end
