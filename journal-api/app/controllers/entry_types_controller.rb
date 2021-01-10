class EntryTypesController < ApplicationController
  def index
    entry_types = EntryType.all
    render json: {
      entry_types: entry_types.map { |entry_type|
        EntryTypeSerializer.new(entry_type).serialize
      }
    }
  end
end
