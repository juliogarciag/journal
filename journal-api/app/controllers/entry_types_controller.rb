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

  def create
    entry_type = EntryType.create!(create_params.merge(row_order_position: 0))
    render json: { entry_type: EntryTypeSerializer.new(entry_type).serialize }
  end

  def destroy
    entry_type = EntryType.find(params[:id])
    entry_type.destroy!
    render json: { deleted: true }
  end

  def can_be_deleted
    entry_type = EntryType.find(params[:id])
    render json: { can_be_deleted: entry_type.can_be_deleted? }
  end

  private

  def update_params
    @update_params ||= params.require(:entry_type).permit(
      :name, :icon, :data_type, :row_order_position
    )
  end

  def create_params
    @create_params ||= params.require(:entry_type).permit(
      :name, :icon, :data_type
    )
  end
end
