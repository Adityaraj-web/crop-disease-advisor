import { cn } from "@/lib/utils";

type SpinnerSize = "sm" | "md" | "lg";

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  className?: string;
  label?: string; // accessible label for screen readers
}

const SIZE_MAP: Record<SpinnerSize, { svg: string; stroke: number }> = {
  sm: { svg: "16", stroke: 2 },
  md: { svg: "24", stroke: 2.5 },
  lg: { svg: "40", stroke: 3 },
};

export default function LoadingSpinner({
  size = "md",
  className,
  label = "Loading…",
}: LoadingSpinnerProps) {
  const { svg, stroke } = SIZE_MAP[size];
  const r = (parseInt(svg) - stroke * 2) / 2;
  const cx = parseInt(svg) / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <span
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center justify-center", className)}
    >
      <svg
        width={svg}
        height={svg}
        viewBox={`0 0 ${svg} ${svg}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-spin"
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx={cx}
          cy={cx}
          r={r}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        {/* Active arc — 25% of circumference */}
        <circle
          cx={cx}
          cy={cx}
          r={r}
          stroke="#4ade80"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.25} ${circumference * 0.75}`}
          strokeDashoffset={circumference * 0.25}
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}