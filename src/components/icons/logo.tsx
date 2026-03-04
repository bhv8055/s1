import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <title>SwastyaScan Logo</title>
      <path d="M19.5 12.5c-2.5 2.5-6.5 4-9.5 0s-4-7 0-9.5c2.5-2.5 6.5-4 9.5 0" />
      <path d="M12.5 19.5c2.5-2.5 4-6.5 0-9.5s-7-4-9.5 0" />
      <circle cx="11" cy="11" r="3" stroke="hsl(var(--accent))" />
      <line x1="13.5" y1="13.5" x2="16.5" y2="16.5" stroke="hsl(var(--accent))" />
    </svg>
  );
}
