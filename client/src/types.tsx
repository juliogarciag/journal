import {
  Entry as PrismaEntry,
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

export type EntryType = {
  id: number;
  name: string;
  icon: EntryTypeIconType;
  dataType: string;
  rowOrderPosition: number;
};

export type EntryValue = string | number | boolean | null;

export interface Entry extends PrismaEntry {
  value: EntryValue;
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

export { MetricType, EntryTypeIconType };
