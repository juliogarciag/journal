class EntryTypeSerializer
  attr_accessor :entry_type

  def initialize(entry_type)
    self.entry_type = entry_type
  end

  def serialize
    {
      id: entry_type.id,
      name: entry_type.name,
      data_type: entry_type.data_type
    }
  end
end
