class CreateEntryTypes < ActiveRecord::Migration[6.1]
  def change
    create_table :entry_types do |t|
      t.integer :data_type, null: false
      t.string :name, null: false

      t.timestamps
    end

    add_index :entry_types, :name, unique: true
  end
end
