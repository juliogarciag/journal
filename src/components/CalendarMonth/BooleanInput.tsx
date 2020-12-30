import { useCallback } from "react";
import Button from "components/atoms/Button";

type BooleanInputProps = {
  value: boolean | null;
  onChange: (value: boolean | null) => void;
};
function BooleanInput({ value, onChange }: BooleanInputProps) {
  const handleYesClick = useCallback(() => {
    if (value === true) {
      onChange(null);
    } else {
      onChange(true);
    }
  }, [value, onChange]);

  const handleNoClick = useCallback(() => {
    if (value === false) {
      onChange(null);
    } else {
      onChange(false);
    }
  }, [value, onChange]);

  return (
    <>
      <Button
        onClick={handleYesClick}
        variant={value === true ? "outstanding" : "default"}
      >
        Yes 👌
      </Button>
      <Button
        onClick={handleNoClick}
        variant={value === false ? "outstanding" : "default"}
      >
        No 🙈
      </Button>
    </>
  );
}

export default BooleanInput;
