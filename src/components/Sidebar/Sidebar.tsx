import { faCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "components/atoms/Button";
import Spacer from "components/atoms/Spacer";
import EntryTypeIcon from "components/EntryTypeIcon";
import fetchApi from "fetchApi";
import useToday from "lib/useToday";
import { Suspense, useCallback } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { MetricType, MetricTypeType } from "types";

function MetricNumber({ metric }: { metric: MetricType }) {
  if (
    metric.metricType === MetricTypeType.Proportion &&
    metric.proportionData
  ) {
    const { totalCount, yesCount } = metric.proportionData;
    const percentage = (yesCount / totalCount) * 100;

    return (
      <span className="pl-2 text-3xl flex items-center">
        <span>{Math.floor(percentage)}</span>
        <span className="text-xl pl-2">%</span>
      </span>
    );
  } else if (
    metric.metricType === MetricTypeType.Average &&
    metric.averageData
  ) {
    const { average } = metric.averageData;
    return (
      <span className="pl-2 text-3xl flex items-center">
        <span>{Math.round(average)}</span>
        <span className="text-lg pl-2">times</span>
      </span>
    );
  } else {
    return null;
  }
}

function MetricSubText({ metric }: { metric: MetricType }) {
  if (
    metric.metricType === MetricTypeType.Proportion &&
    metric.proportionData
  ) {
    const { totalCount, yesCount } = metric.proportionData;

    return (
      <div className="text-center text-sm pt-1">
        {yesCount} days out of {totalCount}
      </div>
    );
  } else if (metric.metricType === MetricTypeType.Average) {
    return <div className="text-center text-sm pt-1">is the daily average</div>;
  } else {
    return null;
  }
}

function YearMetrics({ year }: { year: number }) {
  const today = useToday();

  const fetchYearMetrics = useCallback(async () => {
    const response = await fetchApi("/metrics", {
      query: {
        today: today.toISODate(),
        year: year.toString(),
      },
    });
    return response.json();
  }, [today, year]);

  const { data } = useQuery(["yearMetrics", year], fetchYearMetrics);

  const metrics: Array<MetricType> = data.metrics;

  return (
    <div
      className="p-8 flex flex-wrap justify-around m-auto"
      style={{ marginTop: "-2rem" }}
    >
      {metrics.map((metric) => {
        return (
          <div key={metric.id} className="flex flex-col items-center pr-8 mt-8">
            <div className="flex items-center">
              <EntryTypeIcon
                icon={metric.entryType.icon}
                size="2x"
                className="text-green-800"
              />
              <MetricNumber metric={metric} />
            </div>
            <MetricSubText metric={metric} />
          </div>
        );
      })}
    </div>
  );
}

function Sidebar() {
  return (
    <div className="bg-gray-200 w-full h-screen sticky top-0 left-0 px-6 py-4">
      <Spacer className="h-2" />
      <header className="p-2">
        <h1 className="text-2xl">
          <Link to="/">Journal</Link>
        </h1>
      </header>
      <Spacer className="h-4" />
      <div className="bg-gray-300 p-2 rounded-xl">
        <Suspense fallback={<span>Loading...</span>}>
          <YearMetrics year={2021} />
        </Suspense>
      </div>
      <Spacer className="h-6" />
      <ul className="p-4 text-lg border-gray-400 border-solid border-t">
        <li className="pb-4 pt-2">
          <FontAwesomeIcon icon={faCog} />
          <Link to="/settings" className="pl-2">
            Settings
          </Link>
        </li>
        <li>
          <FontAwesomeIcon icon={faSignOutAlt} />
          <Button className="pl-2">Sign out</Button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
