class DailyEntriesController < ApplicationController
  def show
    entries = load_and_ensure_daily_entries
    render json: { entries: serialize_entries(entries) }
  end

  private

  def load_and_ensure_daily_entries
    current_entries = Entry.where(day: params[:date])

    all_entry_type_ids = EntryType.pluck(:id)
    current_entry_type_ids = current_entries.pluck(:entry_type_id)
    missing_entry_type_ids = all_entry_type_ids - current_entry_type_ids

    if missing_entry_type_ids.any?
      missing_entry_type_ids.each do |entry_type_id|
        Entry.create!(entry_type_id: entry_type_id, day: params[:date])
      end
      current_entries.reload
    end

    current_entries
  end

  def serialize_entries(entries)
    entries.includes(:entry_type).map do |entry|
      EntrySerializer.new(entry).serialize
    end
  end
end
