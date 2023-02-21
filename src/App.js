import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import {
  DEFAULT_LOCATIONS_LIST,
  CIRCLE_RADIUS,
  BUS_STOP_TIMEOUT,
} from "./constants";
import {
  generateLocationPostions,
  getPositionFromQuandrantAndRadius,
} from "./utils/postion";

const positions = generateLocationPostions(
  DEFAULT_LOCATIONS_LIST,
  CIRCLE_RADIUS
);

function App() {
  const [currPosition, setCurrPosition] = useState(positions[0]);
  const [pause, setPause] = useState(false);
  const [stop, setStop] = useState(false);
  const [ignoreLocation, setIgnoreLocation] = useState(false);
  const [start, setStart] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);


  const currDegree = useRef(0);
  const timerRun = useRef(null);
  const timerWait = useRef(null);

  useEffect(() => {
    if (!start) {
      currDegree.current = 0;
      setCurrPosition((prev) => ({ prev, ...positions[0] }));
    } else {
      if (pause || stop) {
        clearInterval(timerRun.current);
      } else {
        timerRun.current = setInterval(() => {

          const isBusMatchingLocation =  positions.some((pos) => {
            return pos.x === currPosition.x && pos.y === currPosition.y;
          })

          if (isBusMatchingLocation && !ignoreLocation) {
            setStop(true);

            timerWait.current = setTimeout(() => {
              setStop(false);
            }, BUS_STOP_TIMEOUT);
          }

          currDegree.current++;
          const currentPos = getPositionFromQuandrantAndRadius(
            currDegree.current % 360,
            CIRCLE_RADIUS
          );
          setCurrPosition((prev) => ({ ...prev, ...currentPos }));
        }, 100);
      }
    }

    return () => {
      clearInterval(timerRun.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pause, stop, ignoreLocation, start]);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {!start
            ? "Đợi tín hiệu để bắt đầu khởi hành"
            : pause
            ? "Bus đang tạm dừng!"
            : `Đang tới bến ${positions[currentIndex].title}`}
        </p>
        <svg width={CIRCLE_RADIUS * 2} height={CIRCLE_RADIUS * 2}>
          <circle
            cx={CIRCLE_RADIUS}
            cy={CIRCLE_RADIUS}
            r={CIRCLE_RADIUS}
            fill="none"
            stroke="red"
            strokeWidth="2"
          />
          <g>
            <circle
              cx={currPosition.x}
              cy={currPosition.y}
              r="10"
              fill="black"
            ></circle>
            {positions.map((position, index) => (
              <circle
                key={index}
                title={position.title}
                cx={position.x}
                cy={position.y}
                r="10"
                fill="black"
              ></circle>
            ))}
          </g>
        </svg>
        <div>
          <button onClick={() => setStart(!start)}>
            {start ? "Reset" : "Khởi hành"}
          </button>

          <button onClick={() => setPause(!pause)}>
            {pause ? "Tiếp tục" : "Tạm dừng"}
          </button>

          <button onClick={() => setIgnoreLocation(!ignoreLocation)}>
            {ignoreLocation
              ? "Bỏ chờ tại bến"
              : `Chờ ${BUS_STOP_TIMEOUT}ms tại bến ${positions[currentIndex].title}`}
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
