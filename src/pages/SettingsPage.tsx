import Spacer from "components/atoms/Spacer";
import EntryTypeIcon from "components/EntryTypeIcon";
import fetchApi from "fetchApi";
import { Fragment, Suspense, useCallback } from "react";
import { useMutation, useQuery } from "react-query";
import { EntryTypeType } from "types";

function SettingsPage() {
  const fetchEntryTypes = useCallback(async () => {
    const response = await fetchApi("/entry_types");
    return response.json();
  }, []);

  const updateEntryTypeMutation = useMutation(
    async (attributes: { id: Number; key: string; value: string }) => {
      const { id, key, value } = attributes;
      const response = await fetchApi(`/entry_types/${id}`, {
        method: "PATCH",
        body: { entryType: { [key]: value } },
      });
      return response.json();
    }
  );

  const {
    data: { entryTypes },
  } = useQuery("entryTypes", fetchEntryTypes);

  return (
    <div className="flex justify-center">
      <div className="w-124 pt-8">
        <h1 className="text-2xl text-center">Entry Types</h1>
        <Spacer className="h-12" />
        <div>
          {entryTypes.map((entryType: EntryTypeType) => {
            return (
              <Fragment key={entryType.id}>
                <div className="flex flex-row p-4 border rounded-lg text-lg">
                  <div className="flex flex-col">
                    <div className="">{entryType.name}</div>
                    <div className="italic">{entryType.dataType}</div>
                  </div>
                  <div className="ml-auto flex items-center">
                    <EntryTypeIcon
                      icon={entryType.icon}
                      color={entryType.iconColor}
                      size="lg"
                    />
                  </div>
                </div>
                <Spacer className="h-2" />
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SettingsPageWrapper() {
  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <SettingsPage />
    </Suspense>
  );
}

export default SettingsPageWrapper;
