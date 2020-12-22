const GRID_SIZE = 4;

const ALPHABET = [...'abcdefghijklmnopqrstuvwxyz'];
const ALPHABET_RANGE = [0, ALPHABET.length - 1];

const GAME_BOARD_ID = 'board';
let GAME_BOARD_EL;

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

const setupGame = () => {
  const tileCount = getTileCount();
  const tileCharacters = getTileCharacters(tileCount);
  const tileElements = getTileElements(tileCharacters);

  setGameBoardElement();
  addTilesToBoard(tileElements);
};


document.addEventListener('DOMContentLoaded', setupGame);
