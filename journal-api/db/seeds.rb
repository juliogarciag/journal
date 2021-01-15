EntryType.create_with(
  data_type: :time,
  icon: "sun"
).find_or_create_by(name: "Wake up time")
EntryType.create_with(
  data_type: :boolean,
  icon: "dumbbell"
).find_or_create_by!(name: "Workout?")
EntryType.create_with(
  data_type: :boolean,
  icon: "tooth"
).find_or_create_by!(name: "Did you brush your teeth?")
EntryType.create_with(
  data_type: :boolean,
  icon: "smile-beam"
).find_or_create_by!(name: "Skin care?")
EntryType.create_with(
  data_type: :quantity,
  icon: "pastafarianism"
).find_or_create_by!(name: "Kraken releases?")
EntryType.create_with(
  data_type: :time,
  icon: "moon"
).find_or_create_by!(name: "Sleep time")
