import Link from "next/link";
import { tv } from "tailwind-variants";
import { cx, focusRing } from "@/lib/utils";
import { Progress } from "@/shared/icons";

export const buttonStyles = tv({
  base: [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control font-medium",
    "transition-colors duration-150 select-none",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    ...focusRing,
  ],
  variants: {
    variant: {
      primary: "bg-brand text-brand-ink hover:bg-brand-hover",
      secondary: "border border-line bg-surface text-ink hover:border-brand hover:text-brand",
      ghost: "text-ink hover:bg-brand-soft",
      danger: "bg-danger text-white hover:opacity-90",
    },
    size: {
      sm: "h-9 px-3.5 text-sm",
      md: "h-11 px-5 text-[0.9375rem]",
      lg: "h-12 px-6 text-base",
    },
    block: { true: "w-full" },
  },
  defaultVariants: { variant: "primary", size: "md" },
});

/** Botão. Com `href` renderiza um link com o mesmo aspecto. `loading` desactiva e mostra spinner. */
export default function Button({
  variant,
  size,
  block,
  loading = false,
  href,
  className,
  children,
  ...props
}) {
  const classes = cx(buttonStyles({ variant, size, block }), className);
  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type="button"
      className={classes}
      disabled={loading || props.disabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Progress size={18} className="animate-spin" />}
      {children}
    </button>
  );
}
