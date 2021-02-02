import Button, { VariantType } from "components/atoms/Button";
import Spacer from "components/atoms/Spacer";
import fetchApi from "fetchApi";
import { useCallback, useState } from "react";
import { useQuery } from "react-query";
import { MetricTemplate } from "types";
import MetricTemplateBlock from "./MetricTemplateBlock";
import NewMetricTemplateForm from "./NewMetricTemplateForm";

function MetricSettings() {
  const fetchMetricTemplates = useCallback(async () => {
    const response = await fetchApi("/metric-templates");
    return response.json();
  }, []);

  const { data } = useQuery("metricTemplates", fetchMetricTemplates);
  const metricTemplates: Array<MetricTemplate> = data.metricTemplates;

  const [showCreationForm, setShowCreationForm] = useState(false);

  const displayCreationForm = useCallback(() => setShowCreationForm(true), []);
  const hideCreationForm = useCallback(() => setShowCreationForm(false), []);

  return (
    <>
      <div className="flex">
        <h1 className="text-2xl">Metric Templates</h1>
        {showCreationForm ? null : (
          <Button
            variant={VariantType.Outstanding}
            className="ml-auto px-2"
            onClick={displayCreationForm}
          >
            New Metric Template
          </Button>
        )}
      </div>
      {showCreationForm ? (
        <>
          <Spacer className="h-6" />
          <NewMetricTemplateForm onCancel={hideCreationForm} />
        </>
      ) : null}
      <Spacer className="h-12" />
      {metricTemplates.map((metricTemplate: MetricTemplate) => {
        return (
          <MetricTemplateBlock
            key={metricTemplate.id}
            metricTemplate={metricTemplate}
          />
        );
      })}
    </>
  );
}

export default MetricSettings;
