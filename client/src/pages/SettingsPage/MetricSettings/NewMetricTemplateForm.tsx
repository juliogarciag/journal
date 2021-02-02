import { useCallback } from "react";
import MetricTemplateForm from "./MetricTemplateForm";
import useCreateMetricTemplate from "./useCreateMetricTemplate";

type NewMetricTemplateProps = {
  onCancel: () => void;
};
function NewMetricTemplate({ onCancel }: NewMetricTemplateProps) {
  const createMetricTemplateMutation = useCreateMetricTemplate();

  const createMetricTemplate = useCallback(
    async (attributes) => {
      return await createMetricTemplateMutation.mutateAsync(attributes);
    },
    [createMetricTemplateMutation]
  );

  return (
    <div className="pt-2 py-4 px-4 border rounded-md shadow-md">
      <MetricTemplateForm onCancel={onCancel} save={createMetricTemplate} />
    </div>
  );
}

export default NewMetricTemplate;
