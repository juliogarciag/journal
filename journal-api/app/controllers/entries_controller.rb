class EntriesController < ApplicationController
  def update
    entry = Entry.find(params[:id])
    entry.update!(update_params)
    render json: { entry: EntrySerializer.new(entry).serialize }
  end

  private

  def update_params
    @update_params ||= params.require(:entry).permit(:value)
  end
end
