import {
  Entry as PrismaEntry,
  EntryType as PrismaEntryType,
  MetricTemplate as PrismaMetricTemplate,
  EntryDataType,
  MetricType,
} from "../../server/node_modules/.prisma/client";

enum EntryTypeIconType {
  Sun = "sun",
  Dumbbell = "dumbbell",
  SmileBeam = "smile-beam",
  Pastafarianism = "pastafarianism",
  Moon = "moon",
  Tooth = "tooth",
  Unknown = "unknown",
}

export interface EntryType extends PrismaEntryType {
  icon: EntryTypeIconType;
  rowOrderPosition: number;
}

export type EntryValue = string | number | boolean | null;

export interface Entry extends PrismaEntry {
  value: EntryValue;
  entryType: EntryType;
}

export interface MetricTemplate extends PrismaMetricTemplate {
  entryType: EntryType;
}

export type Metric = {
  id: number;
  metricType: MetricType;
  entryType: EntryType;
  proportionData?: {
    yesCount: number;
    totalCount: number;
  };
  averageData?: {
    average: number;
  };
};

export { MetricType, EntryTypeIconType, EntryDataType };
