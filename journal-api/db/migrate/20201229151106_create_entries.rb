class CreateEntries < ActiveRecord::Migration[6.1]
  def change
    create_table :entries do |t|
      t.date :day, null: false
      t.references :entry_type, null: false, foreign_key: true
      t.boolean :boolean_value
      t.string :time_value
      t.integer :quantity_value

      t.timestamps
    end

    add_index :entries, [:day, :entry_type_id], unique: true
  end
end
