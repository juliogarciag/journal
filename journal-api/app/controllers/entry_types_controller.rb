class EntryTypesController < ApplicationController
  def index
    entry_types = EntryType.rank(:row_order)
    render json: {
      entry_types: entry_types.map { |entry_type|
        EntryTypeSerializer.new(entry_type).serialize
      }
    }
  end

  def update
    entry_type = EntryType.find(params[:id])
    entry_type.update!(update_params)
    render json: { entry_type: EntryTypeSerializer.new(entry_type).serialize }
  end

  private

  def update_params
    @update_params ||= params.require(:entry_type).permit(
      :name, :icon, :icon_color, :data_type, :row_order_position
    )
  end
end
