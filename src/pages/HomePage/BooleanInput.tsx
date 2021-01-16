import { useCallback } from "react";
import Button, { VariantType } from "components/atoms/Button";
import Spacer from "components/atoms/Spacer";

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

  const trueVariant =
    value === true ? VariantType.Outstanding : VariantType.Solid;
  const falseVariant =
    value === false ? VariantType.Outstanding : VariantType.Solid;

  return (
    <>
      <Button onClick={handleYesClick} variant={trueVariant}>
        Yes 👌
      </Button>
      <Spacer className="w-2" />
      <Button onClick={handleNoClick} variant={falseVariant}>
        No 🙈
      </Button>
    </>
  );
}

export default BooleanInput;
