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
