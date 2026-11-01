import { MAP_HEIGHT, MAP_WIDTH, mapPlots, PIN, RIVER, ROAD, trees } from "./mapPlots";

type FieldMapProps = {
  label: string;
  className?: string;
};

// An illustrated map of the farmland around the unit. Put it inside a Reveal: the fields fill in,
// the river and road draw themselves, and then the pin drops into place.
export default function FieldMap({ label, className }: FieldMapProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      <defs>
        <pattern id="crop-rows" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-24)">
          <path d="M0 7h14" stroke="#14261b" strokeOpacity="0.09" strokeWidth="2" />
        </pattern>
      </defs>

      <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#efe4c8" />

      {mapPlots.map((plot, index) => (
        <g
          key={plot.points}
          style={{ animationDelay: `${index * 70}ms` }}
          className="reveal-up transition-[filter] duration-300 hover:brightness-105"
        >
          <polygon points={plot.points} fill={plot.fill} stroke="#efe4c8" strokeWidth="5" strokeLinejoin="round" />
          {plot.rows && <polygon points={plot.points} fill="url(#crop-rows)" />}
        </g>
      ))}

      <path
        d={RIVER}
        pathLength={1}
        fill="none"
        stroke="#8db7c4"
        strokeWidth="14"
        strokeLinecap="round"
        style={{ animationDelay: "600ms" }}
        className="reveal-draw"
      />
      <path
        d={ROAD}
        pathLength={1}
        fill="none"
        stroke="#fbf6ea"
        strokeWidth="16"
        strokeLinecap="round"
        style={{ animationDelay: "800ms" }}
        className="reveal-draw"
      />
      <path
        d={ROAD}
        fill="none"
        stroke="#c9a54e"
        strokeWidth="1.6"
        strokeDasharray="10 12"
        style={{ animationDelay: "1900ms" }}
        className="reveal-up"
      />

      {trees.map((tree, index) => (
        <circle
          key={`${tree.x}-${tree.y}`}
          cx={tree.x}
          cy={tree.y}
          r={tree.r}
          fill="#3d7a35"
          style={{ animationDelay: `${1100 + index * 60}ms`, transformOrigin: `${tree.x}px ${tree.y}px` }}
          className="reveal-pop"
        />
      ))}

      <g transform={`translate(${PIN.x} ${PIN.y})`}>
        {/* Rings spreading out from the foot of the pin, for good. */}
        <ellipse rx="22" ry="8" fill="none" stroke="#1f5a2c" strokeWidth="2" className="map-pulse" />
        <ellipse rx="22" ry="8" fill="none" stroke="#1f5a2c" strokeWidth="2" style={{ animationDelay: "1.2s" }} className="map-pulse" />
        <ellipse rx="7" ry="2.5" fill="#14261b" opacity="0.25" />
        <g style={{ animationDelay: "2000ms" }} className="reveal-drop">
          <path d="M0 0C-4-10-17-22-17-34a17 17 0 0 1 34 0C17-22 4-10 0 0Z" fill="#1f5a2c" />
          <circle cy="-34" r="6.5" fill="#e4c06a" />
          <g style={{ animationDelay: "2500ms" }} className="reveal-up">
            <rect x="24" y="-50" width={label.length * 8.6 + 24} height="30" rx="15" fill="#14261b" />
            <text x="36" y="-30" fill="#f7f1e4" fontSize="14" fontWeight="600" letterSpacing="0.4">
              {label}
            </text>
          </g>
        </g>
      </g>
    </svg>
  );
}
