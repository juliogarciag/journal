class EntrySerializer
  attr_accessor :entry

  def initialize(entry)
    self.entry = entry
  end

  def serialize
    {
      id: entry.id,
      entry_type: EntryTypeSerializer.new(entry.entry_type).serialize,
      entry_type_id: entry.entry_type_id,
      value: entry.value
    }
  end
end
