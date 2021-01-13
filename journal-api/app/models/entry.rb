class Entry < ApplicationRecord
  belongs_to :entry_type, counter_cache: true

  def self.daily_entries(day)
    where(day: day).joins(:entry_type).order("entry_types.row_order")
  end

  def self.with_some_value
    with_some_boolean_value = where.not(boolean_value: nil)
    with_some_time_value = where.not(time_value: nil)
    with_some_quantity_value = where.not(quantity_value: nil)

    with_some_boolean_value.or(with_some_time_value).or(with_some_quantity_value)
  end

  def value
    return boolean_value if entry_type.boolean_data_type?
    return time_value if entry_type.time_data_type?
    return quantity_value if entry_type.quantity_data_type?
    raise StandardError.new("Unknown data type: #{entry_type.data_type}.")
  end

  def value=(new_value)
    self.boolean_value = new_value if entry_type.boolean_data_type?
    self.time_value = new_value if entry_type.time_data_type?
    self.quantity_value = new_value if entry_type.quantity_data_type?
  end
end
