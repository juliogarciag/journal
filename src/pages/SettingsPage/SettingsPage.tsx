import Spacer from "components/atoms/Spacer";
import { Suspense } from "react";
import EntryTypeSettings from "./EntryTypeSettings";

function SettingsPageWrapper() {
  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <div className="flex justify-center">
        <div className="w-124 pt-8">
          <EntryTypeSettings />
          <Spacer className="h-24" />
        </div>
      </div>
    </Suspense>
  );
}

export default SettingsPageWrapper;
