import Spacer from "components/atoms/Spacer";
import { Suspense } from "react";
import EntryTypeSettings from "./EntryTypeSettings";
import MetricSettings from "./MetricSettings";

function SettingsPageWrapper() {
  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <div className="pt-12">
        <div className="m-auto w-124 pt-8 flex flex-col justify-center">
          <EntryTypeSettings />
          <Spacer className="h-8" />
        </div>
        <div className="m-auto w-124 pt-8 flex flex-col justify-center">
          <MetricSettings />
          <Spacer className="h-24" />
        </div>
      </div>
    </Suspense>
  );
}

export default SettingsPageWrapper;
