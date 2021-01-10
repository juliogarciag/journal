EntryType.create_with(
  data_type: :time,
  icon: "sun",
  icon_color: "yellow-500"
).find_or_create_by(name: "Wake up time")
EntryType.create_with(
  data_type: :boolean,
  icon: "dumbbell",
  icon_color: "gray-600"
).find_or_create_by!(name: "Workout?")
EntryType.create_with(
  data_type: :boolean,
  icon: "tooth",
  icon_color: "gray-500"
).find_or_create_by!(name: "Did you brush your teeth?")
EntryType.create_with(
  data_type: :boolean,
  icon: "smile-beam",
  icon_color: "yellow-400"
).find_or_create_by!(name: "Skin care?")
EntryType.create_with(
  data_type: :quantity,
  icon: "pastafarianism",
  icon_color: "red-600"
).find_or_create_by!(name: "Kraken releases?")
EntryType.create_with(
  data_type: :time,
  icon: "moon",
  icon_color: "yellow-400"
).find_or_create_by!(name: "Sleep time")
