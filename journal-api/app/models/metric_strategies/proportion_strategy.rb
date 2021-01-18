module MetricStrategies
  class ProportionStrategy
    def initialize(template, today, year)
      @template = template
      @today = today
      @year = year
    end

    def calculate
      yes_count = Entry.where("extract(year from day) = :year", year: @year)
                       .where(entry_type_id: @template.entry_type_id)
                       .where(boolean_value: true)
                       .count
      total_count = (@today - @today.beginning_of_year).to_i + 1
      { yes_count: yes_count, total_count: total_count }
    end
  end
end
