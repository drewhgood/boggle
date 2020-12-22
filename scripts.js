const GRID_SIZE = 4;
const GAME_DURATION = 180;
const GAME_INTERVAL = 1000;

const ALPHABET = [...'abcdefghijklmnopqrstuvwxyz'];
const ALPHABET_RANGE = [0, ALPHABET.length - 1];

const GAME_BOARD_ID = 'board';
const GAME_TIMER_ID = 'timer';
const TILE_CLASS_NAME = 'tile';

const createDomElement = (content, elementType = 'DIV') => {
  const el = document.createElement(elementType);
  el.innerHTML = content;
  return el;
};

const getRandomInteger = (min = ALPHABET_RANGE[0], max = ALPHABET_RANGE[1]) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

class GameTimer {
  constructor() {
    this.timeRemaining = GAME_DURATION;
    this.gameInterval = GAME_INTERVAL;
    this.timerEl = document.getElementById(GAME_TIMER_ID);

    this.renderTime();
  }

  start() {
    this.gameInterval = GAME_INTERVAL;
    setInterval(() => {
      if (this.timeRemaining === 0) {
        this.stop();
      } else {
        this.decrementTime();
        this.renderTime();
      }
    }, this.gameInterval);
  }

  stop() {
    this.gameInterval = 0;
  }

  reset() {
    this.timeRemaining = GAME_DURATION;
    this.stop();
  }

  formatTime() {
    let secondNum = parseInt(this.timeRemaining, 10);
    let hours = Math.floor(secondNum / 3600);
    let minutes = Math.floor((secondNum - (hours * 3600)) / 60);
    let seconds = secondNum - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = '0' + hours; }
    if (minutes < 10) { minutes = '0' + minutes; }
    if (seconds < 10) { seconds = '0' + seconds; }
    return minutes + ':' + seconds;
  }

  decrementTime() {
    return this.timeRemaining -= 1;
  }

  renderTime() {
    this.timerEl.innerHTML = this.formatTime();
  }
}

class GameBoard {
  constructor() {
    this.tileCount = GRID_SIZE * GRID_SIZE;
    this.tileCharacters = this.getTileCharacters();
    this.tileElements = this.getTileElements();
    this.gameBoardEl = document.getElementById(GAME_BOARD_ID);
    this.addTilesToBoard();
  }

  getTileCharacters() {
    const randomCharacters = [...Array(this.tileCount)].map(() => {
      const randomIndex = getRandomInteger();
      return ALPHABET[randomIndex];
    });
    return randomCharacters;
  }

  getTileElements() {
    const tileElements = this.tileCharacters.map(character => {
      const element = createDomElement(character);
      element.classList.add(TILE_CLASS_NAME);
      element.style.width = '25%';
      element.style.height = '25%';
      return element;
    });
    return tileElements;
  }

  addTilesToBoard() {
    this.tileElements.forEach(tileEl => {
      this.gameBoardEl.appendChild(tileEl);
    });
  }
}

class GameSession {
  constructor() {
    this.timer = new GameTimer();
    this.board = new GameBoard();
  }

  start() {
    this.reset();
    this.timer.start();
  }

  stop() {
    this.timer.stop();
  }

  reset() {
    this.timer.reset();
  }
}

const startGame = () => {
  const game = new GameSession();
  game.start();
};

document.addEventListener('DOMContentLoaded', startGame);
