class EntrySerializer
  attr_accessor :entry

  def initialize(entry)
    self.entry = entry
  end

  def serialize
    {
      id: entry.id,
      entry_type: EntryTypeSerializer.new(entry.entry_type).serialize,
      value: entry.value
    }
  end
end
