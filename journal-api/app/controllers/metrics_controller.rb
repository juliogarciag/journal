class MetricsController < ApplicationController
  def index
    today = Date.parse(params.require(:today))
    year = params.require(:year).to_i

    year_entries = Entry.where("extract(year from day) = :year", year: year).includes(:entry_type)

    metric_templates = MetricTemplate.all
    metrics = metric_templates.map do |template|
      entry_type_id = template.entry_type_id

      if template.proportion_metric_type?
        entry_type_entries = year_entries.where(entry_type_id: entry_type_id)
        total_count = (today - today.beginning_of_year).to_i + 1
        yes_count = entry_type_entries.where(boolean_value: true).count

        {
          id: template.id,
          metric_type: template.metric_type,
          entry_type: EntryTypeSerializer.new(template.entry_type).serialize,
          proportion_data: { yes_count: yes_count, total_count: total_count }
        }
      elsif template.average_metric_type?
        sum = year_entries.where(entry_type_id: entry_type_id)
                    .where("day <= :today", today: today)
                    .sum(:quantity_value)
        total_count = (today - today.beginning_of_year).to_i + 1

        {
          id: template.id,
          metric_type: template.metric_type,
          entry_type: EntryTypeSerializer.new(template.entry_type).serialize,
          average_data: { average: sum / total_count }
        }
      end
    end

    render json: { metrics: metrics }
  end
end
