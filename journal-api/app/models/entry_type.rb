class EntryType < ApplicationRecord
  include RankedModel

  ranks :row_order

  has_many :entries

  enum data_type: {
    boolean: 0,
    time: 1,
    quantity: 2
  }, _suffix: true
end
