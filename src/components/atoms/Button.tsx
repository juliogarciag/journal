import clsx from "clsx";
import { CSSProperties, MouseEvent, ReactNode } from "react";
import noop from "lib/noop";

const VARIANT_CLASSES: { [key: string]: string } = {
  default: "",
  outstanding: "bg-green-600 text-white",
};

type ButtonProps = {
  children: ReactNode;
  variant?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  style?: CSSProperties;
  disabled?: boolean;
};
function Button({
  children,
  onClick = noop,
  style = {},
  variant = "default",
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        "px-2 py-1 rounded-full border-solid border border-gray-400",
        VARIANT_CLASSES[variant] || "",
        { "text-gray-400 cursor-not-allowed": disabled }
      )}
      onClick={onClick}
      style={{ outline: "none", ...style }}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
