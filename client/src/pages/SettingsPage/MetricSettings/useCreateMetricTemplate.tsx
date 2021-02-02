import fetchApi from "fetchApi";
import useToday from "lib/useToday";
import { useMutation, useQueryClient } from "react-query";
import { MetricType } from "types";

function useCreateMetricTemplate() {
  const queryClient = useQueryClient();
  const today = useToday();

  return useMutation(
    async (values: { metricType: MetricType; entryTypeId: number }) => {
      const response = await fetchApi(`/metric-templates`, {
        method: "POST",
        body: {
          metricTemplate: values,
        },
      });
      return response.json();
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries("metricTemplates");
        queryClient.invalidateQueries(["yearMetrics", today.year]);
      },
    }
  );
}

export default useCreateMetricTemplate;
