import { useEffect, useRef, useState } from "react";
import "./App.css";
import {
  DEFAULT_LOCATIONS_LIST,
  CIRCLE_RADIUS,
  BUS_STOP_TIMEOUT,
  SVG_WIDTH,
  CENTER_SVG_POS,
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
  const [currentPosition, setCurrentPostition] = useState(positions[0]);
  const [isPause, setIsPause] = useState(false);
  const [isStop, setIsStop] = useState(false);
  const [isIgnoreWaitInNextLocation, setIsIgnoreWaitInNextLocation] =
    useState(false);
  const [isBusStarted, setIsBusStarted] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);

  const degree = useRef(0); // start at 0 degree
  const timerRunId = useRef(null);
  const timerWaitId = useRef(null);

  useEffect(() => {
    if (!isBusStarted) {
      if (isBusStarted !== undefined) {
        degree.current = 0;
        setCurrentPostition((prev) => ({ ...prev, ...positions[0] }));
        setCurrentIndex(0);
      }
    } else {
      if (isPause || isStop) {
        console.log("Bus is pause or stop!");
        //clear timer run
        clearInterval(timerRunId.current);
      } else {
        timerRunId.current = setInterval(() => {
          const position = getPositionFromQuandrantAndRadius(
            degree.current % 360,
            CIRCLE_RADIUS
          );
          setCurrentPostition((prev) => ({ ...prev, ...position }));

          let index = positions.findIndex((pos) => {
            return pos.x === position.x && pos.y === position.y;
          });

          degree.current++;

          if (index >= 0) {
            index = (index + 1) % 10;
            if (isIgnoreWaitInNextLocation) {
              clearTimeout(timerWaitId.current);
              setCurrentIndex(
                (prev) => (prev + 1) % DEFAULT_LOCATIONS_LIST.length
              );
              setIsIgnoreWaitInNextLocation(false);
            } else {
              setIsStop(true);
              console.log("Wait 3000ms");

              timerWaitId.current = setTimeout(() => {
                setCurrentIndex(
                  (prev) => (prev + 1) % DEFAULT_LOCATIONS_LIST.length
                );
                setIsStop(false);
              }, BUS_STOP_TIMEOUT);
            }
          }
        }, 100);
      }
    }

    return () => clearInterval(timerRunId.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPause, isStop, isIgnoreWaitInNextLocation, isBusStarted]);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {!isBusStarted
            ? "Đợi tín hiệu để bắt đầu khởi hành"
            : isPause
            ? `Bus đang tạm dừng`
            : isStop
            ? `Xe đang chờ tại bến ${positions[currentIndex].title}, đi tiếp sau ${BUS_STOP_TIMEOUT}ms`
            : `Đang tới bến ${positions[currentIndex].title}`}
        </p>
        <svg width={SVG_WIDTH} height={SVG_WIDTH}>
          <circle
            cx={CENTER_SVG_POS.x}
            cy={CENTER_SVG_POS.y}
            r={CIRCLE_RADIUS}
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <g>
            {positions.map((position, index) => (
              <>
                <circle
                  key={index}
                  title={position.title}
                  cx={position.x}
                  cy={position.y}
                  r="10"
                  fill="white"
                ></circle>
                <text
                  x={position.x}
                  y={position.y}
                  text-anchor="middle"
                  fontSize={11}
                  fontWeight="bold"
                  dy=".3em"
                  fill="red"
                >
                  {position.title}
                </text>
              </>
            ))}

            <circle
              cx={currentPosition.x}
              cy={currentPosition.y}
              r="10"
              fill="red"
            ></circle>
            <text
              x={currentPosition.x}
              y={currentPosition.y}
              text-anchor="middle"
              fontSize={9}
              fontWeight="bold"
              dy=".3em"
              fill="white"
            >
              BUS
            </text>
          </g>
        </svg>
        <div>
          <button onClick={() => setIsBusStarted(!isBusStarted)}>
            {isBusStarted ? "Reset" : "Khởi hành"}
          </button>

          <button onClick={() => setIsPause(!isPause)}>
            {isPause ? "Tiếp tục" : "Tạm dừng"}
          </button>

          <button
            onClick={() =>
              setIsIgnoreWaitInNextLocation(!isIgnoreWaitInNextLocation)
            }
          >
            {isIgnoreWaitInNextLocation
              ? `Đã bỏ chờ tại bến ${positions[currentIndex].title}`
              : `Đã chờ ${BUS_STOP_TIMEOUT}ms tại bến ${positions[currentIndex].title}`}
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
