class MetricsController < ApplicationController
  def index
    today = Date.parse(params.require(:today))
    year = params.require(:year).to_i

    metric_templates = MetricTemplate.includes(:entry_type)
    metrics = metric_templates.map do |template|
      {
        :id => template.id,
        :metric_type => template.metric_type,
        :entry_type => EntryTypeSerializer.new(template.entry_type).serialize,
        :"#{template.metric_type}_data" => template.calculate_metrics(today, year)
      }
    end

    render json: { metrics: metrics }
  end
end
