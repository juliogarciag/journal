class AddEmojiToEntryTypes < ActiveRecord::Migration[6.1]
  def change
    add_column :entry_types, :emoji, :string
  end
end
