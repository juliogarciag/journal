export enum EntryTypeIconType {
  Sun = "sun",
  Dumbbell = "dumbbell",
  SmileBeam = "smile-beam",
  Pastafarianism = "pastafarianism",
  Moon = "moon",
  Tooth = "tooth",
  Unknown = "unknown",
}

export type EntryTypeType = {
  id: number;
  name: string;
  icon: EntryTypeIconType;
  dataType: string;
  rowOrderPosition: number;
};

export type EntryValueType = string | number | boolean | null;

export type EntryType = {
  id: number;
  entryTypeId: number;
  value: EntryValueType;
  entryType: EntryTypeType;
};

export enum MetricTypeType {
  Proportion = "proportion",
  Average = "average",
}

export type MetricType = {
  id: number;
  metricType: MetricTypeType;
  entryType: EntryTypeType;
  proportionData?: {
    yesCount: number;
    totalCount: number;
  };
  averageData?: {
    average: number;
  };
};
