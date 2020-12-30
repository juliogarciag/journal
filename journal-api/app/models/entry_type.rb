class EntryType < ApplicationRecord
  has_many :entries

  enum data_type: {
    boolean: 0,
    time: 1,
    quantity: 2
  }, _suffix: true

  before_create :add_sort_position

  def add_sort_position
    self.sort_position = get_new_sort_position
  end

  # This will probably break if we had a ton of reorderings
  # but we don't have any reordering, and a tiny amount of objects
  # so this is fine.
  def get_new_sort_position
    last_entry_type = EntryType.order(sort_position: :desc).first
    return random_offset if last_entry_type.blank?

    last_position = last_entry_type.sort_position
    loop do
      new_position_candidate = last_position + random_offset
      if EntryType.exists?(sort_position: new_position_candidate)
        next
      else
        return new_position_candidate
      end
    end
  end

  def random_offset
    rand(1000..2000)
  end
end
