import "./App.css";
import { DEFAULT_LOCATIONS_LIST, LENGTH, CIRCLE_RADIUS, BUS_STOP_TIMEOUT } from "./constants";
import {generateLocationPostions} from './utils/postion';

const positions = generateLocationPostions(DEFAULT_LOCATIONS_LIST, CIRCLE_RADIUS);

function App() {

  

  return (
    <div className="App">
      <header className="App-header">
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
            {positions.map((position, index) => (
              <circle key={index} title={position.title} cx={position.x} cy={position.y} r="10" fill="black" >
              </circle>
            ))}
            
          </g>
        </svg>
      </header>
    </div>
  );
}

export default App;
