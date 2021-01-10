# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_01_09_150904) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "entries", force: :cascade do |t|
    t.date "day", null: false
    t.bigint "entry_type_id", null: false
    t.boolean "boolean_value"
    t.string "time_value"
    t.integer "quantity_value"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["day", "entry_type_id"], name: "index_entries_on_day_and_entry_type_id", unique: true
    t.index ["entry_type_id"], name: "index_entries_on_entry_type_id"
  end

  create_table "entry_types", force: :cascade do |t|
    t.integer "data_type", null: false
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "sort_position"
    t.string "icon"
    t.string "icon_color"
    t.index ["name"], name: "index_entry_types_on_name", unique: true
    t.index ["sort_position"], name: "index_entry_types_on_sort_position", unique: true
  end

  add_foreign_key "entries", "entry_types"
end
