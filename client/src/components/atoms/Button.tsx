import clsx from "clsx";
import {
  ButtonHTMLAttributes,
  CSSProperties,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import noop from "lib/noop";

export enum VariantType {
  Empty = "empty",
  Solid = "solid",
  Outstanding = "outstanding",
}

const VARIANT_CLASSES: Partial<Record<VariantType, string>> = {
  [VariantType.Empty]: "",
  [VariantType.Solid]:
    "rounded-full px-2 py-1 border-solid border border-gray-400",
};

VARIANT_CLASSES[VariantType.Outstanding] = clsx(
  VARIANT_CLASSES[VariantType.Solid],
  "bg-green-600 text-white"
);

type ButtonProps = {
  children: ReactNode;
  variant?: VariantType;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  style?: CSSProperties;
  disabled?: boolean;
  className?: string;
  title?: string;
};
function Button({
  children,
  onClick = noop,
  type = "button",
  style = {},
  variant = VariantType.Empty,
  disabled = false,
  className = "",
  title,
  ...otherProps
}: ButtonProps) {
  const optionalProps: ButtonHTMLAttributes<HTMLButtonElement> = {};

  if (title) {
    optionalProps.title = title;
  }

  const [mouseDown, setMouseDown] = useState(false);

  const notifyMouseDown = useCallback(() => setMouseDown(true), []);
  const notifyNotMouseDown = useCallback(() => setMouseDown(false), []);

  useEffect(() => {
    document.addEventListener("mousedown", notifyMouseDown);
    document.addEventListener("keydown", notifyNotMouseDown);

    return () => {
      document.removeEventListener("mousedown", notifyMouseDown);
      document.removeEventListener("keydown", notifyNotMouseDown);
    };
  }, [notifyMouseDown, notifyNotMouseDown]);

  return (
    <button
      type={type}
      className={clsx(
        VARIANT_CLASSES[variant] || "",
        {
          "opacity-40 cursor-not-allowed": disabled,
          "focus:outline-none": mouseDown,
        },
        className
      )}
      onClick={onClick}
      disabled={disabled}
      style={style}
      {...optionalProps}
      {...otherProps}
    >
      {children}
    </button>
  );
}

export default Button;
