class RemoveEmojiFromEntryTypes < ActiveRecord::Migration[6.1]
  def change
    remove_column :entry_types, :emoji, :string
  end
end
