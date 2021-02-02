import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "components/atoms/Button";
import Spacer from "components/atoms/Spacer";
import EntryTypeIcon from "components/EntryTypeIcon";
import { CSSProperties, useCallback, useState } from "react";
import { MetricTemplate } from "types";
import MetricTemplateForm from "./MetricTemplateForm";
import useDestroyMetricTemplate from "./useDestroyMetricTemplate";
import useUpdateMetricTemplate from "./useUpdateMetricTemplate";

type EditMetricTemplateFormProps = {
  exitEditMode: () => void;
  metricTemplate: MetricTemplate;
};
function EditMetricTemplateForm({
  exitEditMode,
  metricTemplate,
}: EditMetricTemplateFormProps) {
  const updateMetricTemplateMutation = useUpdateMetricTemplate();

  const updateMetricTemplate = useCallback(
    async (attributes) => {
      return await updateMetricTemplateMutation.mutateAsync({
        id: metricTemplate.id,
        attributes,
      });
    },
    [updateMetricTemplateMutation, metricTemplate]
  );

  const destroyMetricTemplateMutation = useDestroyMetricTemplate();
  const deleteMetricTemplate = useCallback(() => {
    destroyMetricTemplateMutation.mutate({ id: metricTemplate.id });
  }, [destroyMetricTemplateMutation, metricTemplate]);

  return (
    <div className="border-t">
      <div className="px-4 pt-2 pb-4">
        <MetricTemplateForm
          metricTemplate={metricTemplate}
          onCancel={exitEditMode}
          save={updateMetricTemplate}
        />
      </div>
      <div className="bg-gray-400 p-4 text-white flex items-center">
        <p>Do you want to delete this metric template?</p>
        <div className="ml-auto">
          <Button
            className="bg-red-400 hover:bg-red-600 px-4 py-1 rounded-full"
            onClick={deleteMetricTemplate}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

function MetricTemplateBlock({
  metricTemplate,
}: {
  metricTemplate: MetricTemplate;
}) {
  const style: CSSProperties = {
    position: "relative",
  };

  const [inEditMode, setInEditMode] = useState(false);

  const goIntoEditMode = useCallback(() => {
    setInEditMode(true);
  }, [setInEditMode]);

  const exitEditMode = useCallback(() => {
    setInEditMode(false);
  }, [setInEditMode]);

  return (
    <>
      <div
        className="flex flex-col border rounded-lg bg-white shadow-md"
        style={style}
      >
        <div className="flex flex-row text-lg">
          <Button
            className="flex flex-row w-full pr-6 py-2 pl-2"
            title="Edit Type"
            onClick={goIntoEditMode}
          >
            <div className="flex flex-col">
              <div className="w-84 p-2 pb-0 flex flex-row">
                <div className="text-xl">
                  <span className="capitalize">
                    {metricTemplate.metricType.toLowerCase()}
                  </span>{" "}
                </div>
                <div className="pl-2">
                  <FontAwesomeIcon
                    icon={faEdit}
                    size="xs"
                    className="fill-current text-gray-700"
                  />{" "}
                </div>
              </div>
              <div className="p-2 text-gray-800 text-sm flex items-center">
                <span>
                  Uses <strong>{metricTemplate.entryType.name}</strong>
                </span>
              </div>
            </div>
            <div className="ml-auto flex flex-col self-center">
              <EntryTypeIcon icon={metricTemplate.entryType.icon} size="2x" />
            </div>
          </Button>
        </div>
        {inEditMode ? (
          <EditMetricTemplateForm
            exitEditMode={exitEditMode}
            metricTemplate={metricTemplate}
          />
        ) : null}
      </div>
      <Spacer className="h-4" />
    </>
  );
}

export default MetricTemplateBlock;
