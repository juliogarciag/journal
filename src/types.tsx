export type EntryValueType = string | number | boolean | null;

export type EntryTypeType = {
  id: number;
  name: string;
  icon: string;
  iconColor: string;
  dataType: string;
  rowOrderPosition: number;
};

export type EntryType = {
  id: number;
  entryTypeId: number;
  value: EntryValueType;
  entryType: EntryTypeType;
};
