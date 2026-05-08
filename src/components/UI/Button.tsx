import React from "react";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-400",
  secondary:
    "bg-zinc-700 text-zinc-200 hover:bg-zinc-600 focus-visible:ring-zinc-400",
};

/**
 * Reusable button with primary and secondary variants.
 * Includes proper hover, focus, and disabled states.
 * Forwards a ref to the underlying <button> element for focus management.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", disabled, children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center
          px-6 py-2.5 rounded-lg
          text-sm font-semibold
          transition-colors duration-150
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantClasses[variant]}
          ${className}
        `}
        disabled={disabled}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;