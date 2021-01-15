class ChangeIconDefaultValue < ActiveRecord::Migration[6.1]
  def change
    change_column_null :entry_types, :icon, false
    change_column_default :entry_types, :icon, "unknown"
  end
end
