class MetricTemplate < ApplicationRecord
  belongs_to :entry_type

  enum metric_type: {
    proportion: 0,
    average: 1
  }, _suffix: true

  METRIC_STRATEGIES = {
    proportion: MetricStrategies::ProportionStrategy,
    average: MetricStrategies::AverageStrategy
  }

  def calculate_metrics(today, year)
    metric_strategy = METRIC_STRATEGIES[metric_type.to_sym].new(self, today, year)
    metric_strategy.calculate
  end
end
