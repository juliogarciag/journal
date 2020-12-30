EntryType.create_with(
  data_type: :time,
  emoji: "☀️"
).find_or_create_by(name: "Wake up time")
EntryType.create_with(
  data_type: :boolean,
  emoji: "💪"
).find_or_create_by!(name: "Workout?")
EntryType.create_with(
  data_type: :boolean,
  emoji: "🦷"
).find_or_create_by!(name: "Did you brush your teeth?")
EntryType.create_with(
  data_type: :boolean,
  emoji: "😌"
).find_or_create_by!(name: "Skin care?")
EntryType.create_with(
  data_type: :quantity,
  emoji: "🦖"
).find_or_create_by!(name: "Kraken releases?")
EntryType.create_with(
  data_type: :time,
  emoji: "🌙"
).find_or_create_by!(name: "Sleep time")
