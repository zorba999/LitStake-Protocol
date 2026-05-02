export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="LitStake logo"
      style={{ filter: 'drop-shadow(0 0 8px rgba(100,191,211,0.55))' }}
    >
      <rect x="1.25" y="1.25" width="37.5" height="37.5" rx="9"
        fill="#1A2A40" stroke="#64BFD3" strokeWidth="1.5" />
      <text
        x="50%" y="54%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Orbitron', system-ui, sans-serif"
        fontWeight="700"
        fontSize="13"
        letterSpacing="0.5"
        fill="#64BFD3"
      >
        LS
      </text>
    </svg>
  )
}
