import { ReactNode } from "react";

type ButtonProps = { children: ReactNode };
function Button({ children }: ButtonProps) {
  return (
    <button
      type="button"
      className="px-2 py-1 rounded-full border border-solid border-gray-400"
    >
      {children}
    </button>
  );
}

export default Button;
