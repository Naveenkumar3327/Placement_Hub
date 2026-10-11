export function PlacementLogo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 32V23h7v9m3 0V17h7v15m3 0V11h7v21M5 35h30"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m9 18 8-6 6 3 10-9m-7 0h7v7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="33" cy="6" r="2" fill="#87d7f7" />
    </svg>
  );
}