const GRID_SIZE = 4;
const GAME_DURATION = 180;
const GAME_INTERVAL = 1000;
let GAME_TIME_REMAINING;

const ALPHABET = [...'abcdefghijklmnopqrstuvwxyz'];
const ALPHABET_RANGE = [0, ALPHABET.length - 1];

const GAME_BOARD_ID = 'board';
let GAME_BOARD_EL;

const GAME_TIMER_ID = 'timer';
let GAME_TIMER_EL;

const TILE_CLASS_NAME = 'tile';

const getRandomInteger = (min = ALPHABET_RANGE[0], max = ALPHABET_RANGE[1]) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getTileCount = () => {
  return GRID_SIZE * GRID_SIZE;
};

const getTileCharacters = (count) => {
  const randomCharacters = [...Array(count)].map(() => {
    const randomIndex = getRandomInteger();
    return ALPHABET[randomIndex];
  });
  return randomCharacters;
};

const setDomElementStyle = (element) => {
  element.classList.add(TILE_CLASS_NAME);
  element.style.width = '25%';
  element.style.height = '25%';
  return element;
};

const createDomElement = (content, elementType = 'DIV') => {
  const el = document.createElement(elementType);
  el.innerHTML = content;
  return el;
};

const getTileElements = (characters = []) => {
  const tileElements = characters.map(character => {
    const element = createDomElement(character);
    const styledElement = setDomElementStyle(element);
    return styledElement;
  });
  return tileElements;
};

const addTilesToBoard = (tiles = []) => {
  tiles.forEach(tileEl => {
    GAME_BOARD_EL.appendChild(tileEl);
  });
};

const setGameBoardElement = () => {
  GAME_BOARD_EL = document.getElementById(GAME_BOARD_ID);
};

const setGameTimerElement = () => {
  GAME_TIMER_EL = document.getElementById(GAME_TIMER_ID);
};

const setupGame = () => {
  const tileCount = getTileCount();
  const tileCharacters = getTileCharacters(tileCount);
  const tileElements = getTileElements(tileCharacters);

  setGameBoardElement();
  setGameTimerElement();
  setUpGameTimer();
  addTilesToBoard(tileElements);
};

const formatTime = (timeInSeconds) => {
  let secondNum = parseInt(timeInSeconds, 10);
  let hours = Math.floor(secondNum / 3600);
  let minutes = Math.floor((secondNum - (hours * 3600)) / 60);
  let seconds = secondNum - (hours * 3600) - (minutes * 60);

  if (hours < 10) { hours = '0' + hours; }
  if (minutes < 10) { minutes = '0' + minutes; }
  if (seconds < 10) { seconds = '0' + seconds; }
  return minutes + ':' + seconds;
};

const setTimerValue = (seconds) => {
  GAME_TIMER_EL.innerHTML = formatTime(seconds);
};

const setUpGameTimer = () => {
  GAME_TIME_REMAINING = GAME_DURATION;
  setTimerValue(GAME_DURATION);
};

const startTimer = () => {
  setInterval(() => {
    GAME_TIME_REMAINING -= 1;
    GAME_TIMER_EL.innerHTML = formatTime(GAME_TIME_REMAINING);
  }, GAME_INTERVAL);
};


const startGame = () => {
  startTimer();
};


document.addEventListener('DOMContentLoaded', setupGame);

setTimeout(() => {
  startGame();
}, 1500);
