import { memo } from "react";

const Circle = ({children}) => {
  return (
    <>
      <svg width="200" height="200">
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="black"
          stroke-width="2"
        />
        <g>
          <circle cx="60" cy="100" r="5" fill="black" />
          <circle cx="100" cy="60" r="5" fill="black" />
          <circle cx="140" cy="100" r="5" fill="black" />
          <circle cx="100" cy="140" r="5" fill="black" />
        </g>
      </svg>
    </>
  );
};

export default memo(Circle);
