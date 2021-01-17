EntryType.create_with(
  data_type: :time,
  icon: "sun"
).find_or_create_by(name: "Wake up time")

workout_entry_type = EntryType.create_with(
  data_type: :boolean,
  icon: "dumbbell"
).find_or_create_by!(name: "Workout?")
MetricTemplate.create!(
  metric_type: :proportion,
  entry_type: workout_entry_type
)

teeth_entry_type = EntryType.create_with(
  data_type: :boolean,
  icon: "tooth"
).find_or_create_by!(name: "Did you brush your teeth?")
MetricTemplate.create!(
  metric_type: :proportion,
  entry_type: teeth_entry_type
)

skin_care_type = EntryType.create_with(
  data_type: :boolean,
  icon: "smile-beam"
).find_or_create_by!(name: "Skin care?")
MetricTemplate.create!(
  metric_type: :proportion,
  entry_type: skin_care_type
)

releases_type = EntryType.create_with(
  data_type: :quantity,
  icon: "pastafarianism"
).find_or_create_by!(name: "Kraken releases?")
MetricTemplate.create!(
  metric_type: :average,
  entry_type: releases_type
)

EntryType.create_with(
  data_type: :time,
  icon: "moon"
).find_or_create_by!(name: "Sleep time")
