import { RefObject, useCallback, useLayoutEffect } from "react";

function useOnClickOutside(
  handler: (event: Event) => void,
  singleOrMultipleRefs: Array<RefObject<HTMLElement>> | RefObject<HTMLElement>
) {
  const listener = useCallback(
    (event) => {
      const multipleRefs = Array.isArray(singleOrMultipleRefs)
        ? singleOrMultipleRefs
        : [singleOrMultipleRefs];

      const isInsideARef = multipleRefs.some((ref) => {
        return !!ref.current && ref.current.contains(event.target);
      });

      if (isInsideARef) {
        return;
      } else {
        return handler(event);
      }
    },
    [handler, singleOrMultipleRefs]
  );

  useLayoutEffect(() => {
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [listener]);
}

export default useOnClickOutside;
