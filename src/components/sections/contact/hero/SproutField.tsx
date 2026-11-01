import type { CSSProperties } from "react";
import { furrows, pollen, SOIL_HEIGHT, SOIL_WIDTH, sprouts, type Sprout } from "./sprouts";

const round = (value: number) => Math.round(value * 10) / 10;

// One leaf, drawn pointing right from where it joins the stem.
const LEAF = "M0 0C6-7 17-9 26-3C18 3 7 4 0 0Z";

function Leaves({ delay, scale }: { delay: number; scale: number }) {
  return (
    <g style={{ animationDelay: `${Math.round(delay)}ms` }} className="sprout-leaf">
      <path d={LEAF} transform={`scale(${scale}) rotate(-28)`} />
      <path d={LEAF} transform={`scale(${-scale} ${scale}) rotate(-28)`} />
    </g>
  );
}

function SproutPlant({ sprout }: { sprout: Sprout }) {
  const furrow = furrows[sprout.furrow];
  const leafScale = furrow.leafScale;
  const topX = round(sprout.lean);
  const topY = round(-sprout.height);
  const growDelay = sprout.dropDelay + 550;

  return (
    <g transform={`translate(${round(sprout.x)} ${furrow.y})`}>
      <g
        style={
          {
            "--sway-time": `${round(sprout.swaySeconds)}s`,
            "--sway-delay": `${round(sprout.swayDelay)}s`,
          } as CSSProperties
        }
        className="sprout-sway"
      >
        <path
          d={`M0 0Q${round(sprout.lean * 0.1)} ${round(-sprout.height * 0.55)} ${topX} ${topY}`}
          pathLength={1}
          fill="none"
          stroke="#2f6b37"
          strokeWidth={1.4 + sprout.furrow * 0.5}
          strokeLinecap="round"
          style={{ animationDelay: `${Math.round(growDelay)}ms` }}
          className="sprout-stem"
        />
        {sprout.lowerLeaves && (
          <g transform={`translate(${round(sprout.lean * 0.35)} ${round(-sprout.height * 0.45)})`} fill="#4f8a3c">
            <Leaves delay={growDelay + 450} scale={leafScale * 0.7} />
          </g>
        )}
        <g transform={`translate(${topX} ${topY})`} fill="#3d7a35">
          <Leaves delay={growDelay + 750} scale={leafScale} />
        </g>
      </g>
      {/* The seed falls into the furrow before anything grows from it. */}
      <ellipse
        rx={3 * leafScale + 1}
        ry={2 * leafScale + 1}
        fill="#a67c1e"
        style={{ animationDelay: `${Math.round(sprout.dropDelay)}ms` }}
        className="sprout-seed"
      />
    </g>
  );
}

type SproutFieldProps = {
  className?: string;
};

// Seeds drop into furrows, sprout, open their leaves and sway, while pollen drifts above them.
export default function SproutField({ className }: SproutFieldProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${SOIL_WIDTH} ${SOIL_HEIGHT}`}
      preserveAspectRatio="xMidYMax slice"
      className={className}
    >
      {pollen.map((speck, index) => (
        <circle
          key={index}
          cx={round(speck.x)}
          cy={round(speck.y)}
          r={round(speck.size)}
          fill="#e4c06a"
          style={{
            animationDuration: `${round(speck.driftSeconds)}s`,
            animationDelay: `${round(speck.driftDelay)}s`,
          }}
          className="sprout-pollen"
        />
      ))}

      {furrows.map((furrow, furrowIndex) => (
        <g key={furrow.y} opacity={furrow.opacity}>
          {/* The ridge of soil the row is sown along. */}
          <path
            d={`M-20 ${furrow.y + 2}Q${SOIL_WIDTH / 4} ${furrow.y - 5} ${SOIL_WIDTH / 2} ${furrow.y + 2}T${SOIL_WIDTH + 20} ${furrow.y + 2}`}
            pathLength={1}
            fill="none"
            stroke="#86630f"
            strokeWidth={1 + furrowIndex * 0.6}
            strokeLinecap="round"
            style={{ animationDelay: `${furrowIndex * 140}ms` }}
            className="sprout-furrow"
          />
          {sprouts
            .filter((sprout) => sprout.furrow === furrowIndex)
            .map((sprout) => (
              <SproutPlant key={sprout.x} sprout={sprout} />
            ))}
        </g>
      ))}
    </svg>
  );
}
