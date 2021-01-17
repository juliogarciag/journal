class MetricTemplate < ApplicationRecord
  belongs_to :entry_type

  enum metric_type: {
    proportion: 0,
    average: 1
  }, _suffix: true
end
