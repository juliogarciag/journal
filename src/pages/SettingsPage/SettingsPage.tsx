import Spacer from "components/atoms/Spacer";
import { Suspense } from "react";
import EntryTypeSettings from "./EntryTypeSettings";

function SettingsPageWrapper() {
  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <div className="flex justify-center">
        <div className="w-124 pt-8">
          <h1 className="text-2xl text-center">Entry Types</h1>
          <Spacer className="h-12" />
          <EntryTypeSettings />
        </div>
      </div>
    </Suspense>
  );
}

export default SettingsPageWrapper;
