import { Color } from "./Primitives/Color";

export function Loading({
  size,
  fadeIn = false,
}: {
  size: number;
  fadeIn?: boolean;
}) {
  const circumference = Math.PI * 45 * 2;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <circle
        cx={50}
        cy={50}
        r={45}
        fill="none"
        strokeWidth={10}
        stroke={Color.Blue[600]}
        strokeDasharray={circumference * 0.6 + " " + circumference * 0.4}
        strokeLinecap="round"
        strokeDashoffset={0}
      >
        <animate
          attributeName="stroke-dashoffset"
          values={[0, -circumference].join(";")}
          dur="500ms"
          repeatCount="indefinite"
        />
        {fadeIn && (
          <animate
            attributeName="stroke"
            values={`transparent;transparent;${Color.Blue[600]}`}
            dur="700ms"
          />
        )}
      </circle>
    </svg>
  );
}

export function PageLoading() {
  return (
    <div
      css={{
        alignItems: "center",
        paddingBlock: "20vh",
      }}
    >
      <Loading size={20} fadeIn />
    </div>
  );
}
