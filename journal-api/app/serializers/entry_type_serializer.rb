class EntryTypeSerializer
  attr_accessor :entry_type

  def initialize(entry_type)
    self.entry_type = entry_type
  end

  def serialize
    {
      id: entry_type.id,
      name: entry_type.name,
      icon: entry_type.icon,
      data_type: entry_type.data_type,
      row_order_position: entry_type.row_order_position
    }
  end
end
