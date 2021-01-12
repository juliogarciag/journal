import clsx from "clsx";
import {
  ButtonHTMLAttributes,
  CSSProperties,
  MouseEvent,
  ReactNode,
} from "react";
import noop from "lib/noop";

const VARIANT_CLASSES: { [key: string]: string } = {
  empty: "",
  default: "px-2 py-1 border-solid border border-gray-400",
};

VARIANT_CLASSES.outstanding =
  VARIANT_CLASSES.default + " bg-green-600 text-white";

type ButtonProps = {
  children: ReactNode;
  variant?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  style?: CSSProperties;
  disabled?: boolean;
  className?: string;
  title?: string;
};
function Button({
  children,
  onClick = noop,
  style = {},
  variant = "default",
  disabled = false,
  className = "",
  title,
  ...otherProps
}: ButtonProps) {
  const optionalProps: ButtonHTMLAttributes<HTMLButtonElement> = {};

  if (title) {
    optionalProps.title = title;
  }

  return (
    <button
      type="button"
      className={clsx(
        "rounded-full",
        VARIANT_CLASSES[variant] || "",
        { "text-gray-400 cursor-not-allowed": disabled },
        className
      )}
      onClick={onClick}
      style={{ outline: "none", ...style }}
      disabled={disabled}
      {...optionalProps}
      {...otherProps}
    >
      {children}
    </button>
  );
}

export default Button;
