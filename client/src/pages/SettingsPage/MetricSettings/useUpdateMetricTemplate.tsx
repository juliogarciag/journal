import fetchApi from "fetchApi";
import produce from "immer";
import useToday from "lib/useToday";
import { useMutation, useQueryClient } from "react-query";
import { MetricTemplate } from "types";

type MetricTemplatesQueryData = {
  metricTemplates: Array<MetricTemplate>;
};

function useUpdateMetricTemplate() {
  const queryClient = useQueryClient();
  const today = useToday();

  return useMutation(
    async (values: { id: Number; attributes: Partial<MetricTemplate> }) => {
      const { id, attributes } = values;
      const response = await fetchApi(`/metric-templates/${id}`, {
        method: "PATCH",
        body: { metricTemplate: attributes },
      });
      return response.json();
    },
    {
      onMutate: (values: {
        id: Number;
        attributes: Partial<MetricTemplate>;
      }) => {
        const { id, attributes } = values;
        const previousData = queryClient.getQueryData<MetricTemplatesQueryData>(
          "metricTemplates"
        );

        if (previousData && previousData.metricTemplates) {
          const { metricTemplates } = previousData;

          queryClient.setQueryData<MetricTemplatesQueryData>(
            "metricTemplates",
            {
              metricTemplates: produce(metricTemplates, (draft) => {
                const metricTemplate = draft.find(
                  (metricTemplates) => metricTemplates.id === id
                );
                if (metricTemplate) {
                  Object.assign(metricTemplate, attributes);
                }
              }),
            }
          );
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries("metricTemplates");
        queryClient.invalidateQueries(["yearMetrics", today.year]);
      },
    }
  );
}

export default useUpdateMetricTemplate;
