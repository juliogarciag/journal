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

const VARIANT_CLASSES: { [key: string]: string } = {
  empty: "",
  default: "px-2 py-1 border-solid border border-gray-400",
};

VARIANT_CLASSES.outstanding =
  VARIANT_CLASSES.default + " bg-green-600 text-white";

type ButtonProps = {
  children: ReactNode;
  variant?: string;
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
        "rounded-full",
        VARIANT_CLASSES[variant] || "",
        {
          "text-gray-400 cursor-not-allowed": disabled,
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
