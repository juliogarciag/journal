class CreateMetrics < ActiveRecord::Migration[6.1]
  def change
    create_table :metric_templates do |t|
      t.integer :metric_type, null: false
      t.references :entry_type, null: false, foreign_key: true

      t.timestamps
    end
  end
end
