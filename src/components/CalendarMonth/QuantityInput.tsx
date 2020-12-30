import Button from "components/atoms/Button";
import { useCallback } from "react";

type QuantityInputProps = { value: number; onChange: (value: number) => void };
function QuantityInput({ value, onChange }: QuantityInputProps) {
  const handleDownClick = useCallback(() => {
    if (value > 0) {
      onChange(value - 1);
    }
  }, [onChange, value]);

  const handleUpClick = useCallback(() => {
    onChange(value + 1);
  }, [onChange, value]);

  return (
    <>
      <Button onClick={handleDownClick} disabled={value <= 0}>
        ↓
      </Button>
      <code className="p-1">{value}</code>
      <Button onClick={handleUpClick}>↑</Button>
    </>
  );
}

export default QuantityInput;
