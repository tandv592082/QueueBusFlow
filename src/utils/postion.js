/**
 *
 * @param {Array} locations - Total locations of the map
 * @param {Number} R - Circle radius
 * @returns {Array} - Array of positions (x,y)
 */

export const generateLocationPostions = (locations = [], R = 0) => {
  const { length } = locations;
  const positions = [];

  if (!length) {
    return positions;
  }

  const avgDegree = 360 / length;
  let currDegree = 0;

  for (let i = 0; i < length; i++) {
    currDegree += avgDegree;

    positions.push({
      ...getPositionFromQuandrantAndRadius(currDegree, R),
      title: locations[i],
    });
  }

  return positions;
};

const checkQuandrantAngle = (degree) => {
  const quandrant = Math.floor(degree / 90) + 1;

  return quandrant > 4 ? 1 : quandrant;
};

const getPositionFromQuandrantAndRadius = (degree, radius) => {
  const quandrant = checkQuandrantAngle(degree);
  const radian = degreeToRadian(degree % 90);
  const position = { quandrant };

  switch (quandrant) {
    case 1:
      position.x = radius + Math.sin(radian) * radius;
      position.y = radius + Math.cos(radian) * radius;
      break;
    case 2:
      position.x = radius + Math.cos(radian) * radius;
      position.y = radius - Math.sin(radian) * radius;
      break;
    case 3:
      position.x = radius - Math.sin(radian) * radius;
      position.y = radius - Math.cos(radian) * radius;
      break;
    case 4:
      position.x = radius - Math.cos(radian) * radius;
      position.y = radius + Math.sin(radian) * radius;
      break;
    default:
      break;
  }

  return position;
};

const degreeToRadian = (degree) => (Math.PI * degree) / 180;
