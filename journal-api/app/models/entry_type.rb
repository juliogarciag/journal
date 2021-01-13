class EntryType < ApplicationRecord
  include RankedModel

  ranks :row_order

  has_many :entries, dependent: :destroy

  enum data_type: {
    boolean: 0,
    time: 1,
    quantity: 2
  }, _suffix: true

  before_destroy :check_if_can_be_deleted

  def check_if_can_be_deleted
    throw :abort if !can_be_deleted?
  end

  def can_be_deleted?
    entries_count === 0 || entries.with_some_value.empty?
  end
end
