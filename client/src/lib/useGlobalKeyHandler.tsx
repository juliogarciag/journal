import { useCallback, useEffect } from "react";

function useGlobalKeyHandler(
  key: string,
  handleEvent: (event: KeyboardEvent) => void
) {
  const eventHandler = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === key) {
        handleEvent(event);
      }
    },
    [key, handleEvent]
  );

  useEffect(() => {
    document.addEventListener("keydown", eventHandler);
    return () => {
      document.removeEventListener("keydown", eventHandler);
    };
  });
}

export default useGlobalKeyHandler;
