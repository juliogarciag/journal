import fetchApi from "fetchApi";
import useToday from "lib/useToday";
import { useMutation, useQueryClient } from "react-query";

function useDestroyMetricTemplate() {
  const queryClient = useQueryClient();
  const today = useToday();

  return useMutation(
    async (values: { id: number }) => {
      const response = await fetchApi(`/metric-templates/${values.id}`, {
        method: "DELETE",
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

export default useDestroyMetricTemplate;
