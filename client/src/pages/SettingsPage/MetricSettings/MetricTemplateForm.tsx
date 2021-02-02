import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button, { VariantType } from "components/atoms/Button";
import Spacer from "components/atoms/Spacer";
import useEntryTypes from "lib/useEntryTypes";
import { useCallback, useMemo, useState } from "react";
import { EntryDataType, EntryType, MetricTemplate, MetricType } from "types";

const ALLOWED_DATA_TYPES: { [key in MetricType]: Array<EntryDataType> } = {
  [MetricType.AVERAGE]: [EntryDataType.QUANTITY],
  [MetricType.PROPORTION]: [EntryDataType.BOOLEAN],
};

type MetricTemplateFormProps = {
  metricTemplate?: MetricTemplate;
  onCancel: () => void;
  save: (attributes: Partial<MetricTemplate>) => Promise<unknown>;
};
function MetricTemplateForm({
  onCancel,
  metricTemplate,
  save,
}: MetricTemplateFormProps) {
  const [metricType, setMetricType] = useState(metricTemplate?.metricType);
  const [entryType, setEntryType] = useState<EntryType | undefined>(
    metricTemplate?.entryType
  );

  const entryTypes = useEntryTypes();
  const allowedEntryTypes = useMemo(() => {
    if (metricType) {
      const allowedDataTypes = ALLOWED_DATA_TYPES[metricType];
      return entryTypes.filter((entryType) =>
        allowedDataTypes.includes(entryType.dataType)
      );
    } else {
      return [];
    }
  }, [entryTypes, metricType]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      await save({
        metricType,
        entryTypeId: entryType?.id,
      });

      onCancel();
    },
    [save, metricType, entryType, onCancel]
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="py-4">
        <label className="flex items-center">
          <span className="w-24">Metric Type </span>
          <div className="relative">
            <select
              value={metricType || ""}
              onChange={(event) =>
                setMetricType(event.currentTarget.value as MetricType)
              }
              className="appearance-none w-56 px-2 py-1 border border-gray-300"
            >
              <option value=""></option>
              <option value={MetricType.AVERAGE}>Average</option>
              <option value={MetricType.PROPORTION}>Proportion</option>
            </select>
            <div className="absolute top-1 right-2 pointer-events-none">
              <FontAwesomeIcon icon={faCaretDown} />
            </div>
          </div>
        </label>
        <Spacer className="h-4" />
        <label className="flex items-center">
          <span className="w-24">Entry Type</span>
          <div className="relative">
            <select
              value={entryType?.id || ""}
              onChange={(event) => {
                const selectedId = Number(event.currentTarget.value);
                const entryType = entryTypes.find(
                  (entryType) => entryType.id === selectedId
                );
                setEntryType(entryType);
              }}
              className="appearance-none w-56 px-2 py-1 border border-gray-300"
            >
              <option value=""></option>
              {allowedEntryTypes.map((entryType) => {
                return (
                  <option key={entryType.id} value={entryType.id}>
                    {entryType.name}
                  </option>
                );
              })}
            </select>
            <div className="absolute top-1 right-2 pointer-events-none">
              <FontAwesomeIcon icon={faCaretDown} />
            </div>
          </div>
        </label>
        <Spacer className="h-4" />
      </div>
      <div className="flex border-t pt-4">
        <Button
          type="submit"
          variant={VariantType.Solid}
          className="bg-green-600 text-white border-green-600 px-4 py-1 rounded-full"
          disabled={!entryType || !metricType}
        >
          Save
        </Button>
        <Spacer className="w-2" />
        <Button
          variant={VariantType.Solid}
          className="bg-white text-gray-800 px-4 py-1 rounded-full"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default MetricTemplateForm;
