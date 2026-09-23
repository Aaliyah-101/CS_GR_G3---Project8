import { resolveImageUrl } from '../../apis/api'
function Person({ x, y, color, scale = 1, wrap = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {wrap && (
        <path
          d="M -20 -6 Q 0 -26 20 -6 L 16 4 Q 0 -8 -16 4 Z"
          fill={color}
          opacity="0.9"
        />
      )}

      <rect
        x="-16"
        y="8"
        width="32"
        height="52"
        rx="10"
        fill={color}
      />

      <circle
        cx="0"
        cy="-10"
        r="16"
        fill="#0C0A08"
      />

      <circle
        cx="0"
        cy="-10"
        r="13"
        fill="#C89A72"
      />

      <rect
        x="-16"
        y="58"
        width="12"
        height="24"
        rx="4"
        fill="#0C0A08"
      />

      <rect
        x="4"
        y="58"
        width="12"
        height="24"
        rx="4"
        fill="#0C0A08"
      />
    </g>
  )
}


function Base({ children }) {
  return (
    <>
      <rect
        width="400"
        height="300"
        fill="#1C1712"
      />

      <rect
        y="205"
        width="400"
        height="95"
        fill="#12100D"
      />

      {children}
    </>
  )
}


export default function PanelArt({
  artKey,
  colors = [],
  imageUrl,
}) {

  /*
   * --------------------------------
   * REAL GENERATED IMAGE
   * --------------------------------
   *
   * If FastAPI eventually gives us an
   * image URL, display it instead of
   * the placeholder SVG.
   */

  if (imageUrl) {
    return (
      <img
        src={resolveImageUrl(imageUrl)}
        alt="Generated story panel"
        className="h-full w-full object-cover"
      />
    )
  }


  /*
   * --------------------------------
   * CHARACTER COLOUR HELPER
   * --------------------------------
   */

  const c = (i, fallback) =>
    colors[i] || fallback


  /*
   * --------------------------------
   * FALLBACK SVG SCENES
   * --------------------------------
   */

  const scenes = {

    home: (

      <Base>

        <rect
          x="50"
          y="70"
          width="300"
          height="130"
          rx="6"
          fill="#2E271F"
          opacity="0.6"
        />

        <path
          d="M60 80 L200 40 L340 80"
          fill="none"
          stroke="#B85C1F"
          strokeWidth="5"
          strokeLinecap="round"
        />

        <g
          opacity="0.6"
          stroke="#E8A33D"
          strokeWidth="1"
        >

          {Array.from({ length: 9 }).map((_, i) => (

            <line
              key={i}
              x1={110 + i * 20}
              y1="88"
              x2={110 + i * 20}
              y2="190"
            />

          ))}

        </g>

        <Person
          x={110}
          y={175}
          color={c(0, '#E8A33D')}
          wrap
          scale={0.75}
        />

        <Person
          x={230}
          y={188}
          color={c(1, '#B85C1F')}
          scale={0.6}
        />

      </Base>

    ),


    village: (

      <Base>

        <circle
          cx="330"
          cy="55"
          r="28"
          fill="#E8A33D"
          opacity="0.35"
        />

        <path
          d="M70 205 L130 130 L190 205 Z"
          fill="#B85C1F"
          opacity="0.8"
        />

        <ellipse
          cx="270"
          cy="100"
          rx="36"
          ry="20"
          fill="#2E271F"
        />

        <Person
          x={160}
          y={190}
          color={c(0, '#E8A33D')}
          wrap
          scale={0.8}
        />

        <Person
          x={210}
          y={198}
          color={c(1, '#B85C1F')}
          scale={0.6}
        />

      </Base>

    ),


    clinic: (

      <Base>

        <rect
          x="40"
          y="60"
          width="320"
          height="145"
          fill="#2E271F"
        />

        <rect
          x="40"
          y="60"
          width="320"
          height="16"
          fill="#B85C1F"
        />

        <circle
          cx="200"
          cy="60"
          r="9"
          fill="#E8A33D"
        />

        <rect
          x="90"
          y="140"
          width="16"
          height="16"
          fill="#E8A33D"
          opacity="0.6"
        />

        <rect
          x="270"
          y="150"
          width="60"
          height="40"
          rx="4"
          fill="#12100D"
        />

        <Person
          x={150}
          y={195}
          color={c(0, '#E8A33D')}
          scale={0.68}
        />

        <Person
          x={235}
          y={185}
          color={c(1, '#B85C1F')}
          wrap
          scale={0.85}
        />

      </Base>

    ),


    road: (

      <Base>

        <rect
          y="215"
          width="400"
          height="6"
          fill="#3A3128"
        />

        {[0, 1, 2, 3, 4, 5].map((i) => (

          <rect
            key={i}
            x={20 + i * 60}
            y="228"
            width="28"
            height="6"
            fill="#3A3128"
          />

        ))}

        <g transform="translate(150,150)">

          <ellipse
            cx="60"
            cy="70"
            rx="80"
            ry="8"
            fill="#000"
            opacity="0.3"
          />

          <circle
            cx="10"
            cy="65"
            r="17"
            fill="#0C0A08"
          />

          <circle
            cx="95"
            cy="65"
            r="17"
            fill="#0C0A08"
          />

          <path
            d="M0 65 L20 22 L80 22 L100 65 Z"
            fill="#2E271F"
          />

          <rect
            x="58"
            y="0"
            width="8"
            height="24"
            fill="#E8A33D"
          />

        </g>

        <Person
          x={175}
          y={100}
          color={c(0, '#B85C1F')}
          scale={0.68}
        />

        <Person
          x={215}
          y={95}
          color={c(1, '#E8A33D')}
          scale={0.68}
        />

      </Base>

    ),


    market: (

      <Base>

        <rect
          x="50"
          y="120"
          width="300"
          height="20"
          fill="#B85C1F"
          opacity="0.6"
        />

        <rect
          x="60"
          y="140"
          width="60"
          height="55"
          fill="#2E271F"
        />

        <rect
          x="150"
          y="140"
          width="60"
          height="55"
          fill="#2E271F"
        />

        <rect
          x="240"
          y="140"
          width="60"
          height="55"
          fill="#2E271F"
        />

        <Person
          x={140}
          y={188}
          color={c(0, '#E8A33D')}
          wrap
          scale={0.75}
        />

        <Person
          x={220}
          y={192}
          color={c(1, '#B85C1F')}
          scale={0.7}
        />

      </Base>

    ),


    heritage: (

      <Base>

        <path
          d="M60 205 L60 105 Q200 20 340 105 L340 205 Z"
          fill="#B85C1F"
          opacity="0.85"
        />

        {Array.from({ length: 10 }).map((_, i) => (

          <line
            key={i}
            x1={70 + i * 27}
            y1={105 - i}
            x2={70 + i * 27}
            y2="205"
            stroke="#12100D"
            strokeWidth="1.5"
            opacity="0.35"
          />

        ))}

        <Person
          x={200}
          y={195}
          color={c(0, '#E8A33D')}
          scale={0.85}
        />

      </Base>

    ),
  }


  return (

    <svg
      viewBox="0 0 400 300"
      className="h-full w-full"
      role="img"
      aria-label={`Illustration: ${artKey}`}
    >

      {scenes[artKey] || scenes.village}

    </svg>

  )
}