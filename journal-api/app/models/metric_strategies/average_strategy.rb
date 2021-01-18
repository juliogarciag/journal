module MetricStrategies
  class AverageStrategy
    def initialize(template, today, year)
      @template = template
      @today = today
      @year = year
    end

    def calculate
      sum = Entry.where(entry_type_id: @template.entry_type_id)
                 .where("extract(year from day) = :year", year: @year)
                 .where("day <= :today", today: @today)
                 .sum(:quantity_value)
      total_count = (@today - @today.beginning_of_year).to_i + 1
      { average: sum / total_count }
    end
  end
end
