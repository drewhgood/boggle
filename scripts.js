const GRID_SIZE = 4;
const GAME_DURATION = 180;
const GAME_INTERVAL = 1000;

const ALPHABET = [...'abcdefghijklmnoprstuvwxyz', 'qu'];
const ALPHABET_RANGE = [0, ALPHABET.length - 1];

const ID_BOARD_GAME = 'board';
const ID_GAME_TIMER = 'timer';

const CLASS_NAME_GAME_TILE = 'tile';
const CLASS_NAME_GAME_IN_PROGRESS = 'game--in-progress';
const CLASS_NAME_GAME_OVER = 'game--over';
const CLASS_NAME_GAME_STOPPED = 'game--stopped';

const BEEP_SOUND = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU' + Array(1e3).join(123));

const createDomElement = (content, elementType = 'DIV') => {
  const el = document.createElement(elementType);
  el.innerHTML = content;
  return el;
};

const getRandomIntegerInRange = (min = ALPHABET_RANGE[0], max = ALPHABET_RANGE[1]) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

class GameTimer {
  constructor(onTimeExpired) {
    this.gameDuration = GAME_DURATION;
    this.timeRemaining = this.gameDuration;
    this.gameInterval = GAME_INTERVAL;
    this.timerEl = document.getElementById(ID_GAME_TIMER);
    this.onTimeExpired = onTimeExpired;
    this.interval = undefined;
    this.beepSound = BEEP_SOUND;

    this.renderTime();
  }

  start() {
    clearInterval(this.interval);
    this.interval = setInterval(() => this.intervalTick(), this.gameInterval);
  }

  stop() {
    clearInterval(this.interval);
  }

  intervalTick() {
    if (this.timeRemaining <= 0) {
      this.stop();

      if (this.onTimeExpired) {
        this.onTimeExpired();
      }
    } else {
      this.decrementTime();
      this.renderTime();

      if (this.timeRemaining <= 5) {
        this.beep();
      }
    }
  }

  restart() {
    clearInterval(this.interval);
    this.timeRemaining = this.gameDuration;
    this.renderTime();
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

  beep() {
    this.beepSound.play();
  }
}

class GameBoard {
  constructor() {
    this.gridSize = GRID_SIZE;
    this.tileCount = this.gridSize * this.gridSize;
    this.tileCharacters = this.getTileCharacters();
    this.tileElements = this.getTileElements();
    this.gameBoardEl = document.getElementById(ID_BOARD_GAME);
    this.addTilesToBoard();
  }

  restart() {
    this.tileCharacters = this.getTileCharacters();
    this.tileElements = this.getTileElements();
    this.addTilesToBoard();
  }

  getTileCharacters() {
    const randomCharacters = [...Array(this.tileCount)].map(() => {
      const randomIndex = getRandomIntegerInRange();
      return ALPHABET[randomIndex];
    });
    return randomCharacters;
  }

  getTileElements() {
    const tileElements = this.tileCharacters.map(character => {
      const element = createDomElement(character);
      element.classList.add(CLASS_NAME_GAME_TILE);
      const tilePercentSize = 100 / this.gridSize;
      element.style.width = `calc(${tilePercentSize}% - 10px)`;
      element.style.height = `calc(${tilePercentSize}% - 10px)`;
      return element;
    });
    return tileElements;
  }

  addTilesToBoard() {
    this.gameBoardEl.innerHTML = '';
    this.tileElements.forEach(tileEl => {
      this.gameBoardEl.appendChild(tileEl);
    });
  }
}

class GameSession {
  constructor() {
    this.timer = new GameTimer(() => this.stop(true));
    this.board = new GameBoard();
    this.pageEl = document.body;
    this.setUpButtons();
  }

  start() {
    this.timer.start();
    this.removeAllClasses();
    this.addClassToPage(CLASS_NAME_GAME_IN_PROGRESS);
  }

  restart() {
    this.timer.restart();
    this.board.restart();
    this.removeAllClasses();
  }

  stop(isGameOver) {
    this.timer.stop();
    this.removeAllClasses();

    const className = isGameOver ? CLASS_NAME_GAME_OVER : CLASS_NAME_GAME_STOPPED;
    this.addClassToPage(className);
  }

  removeAllClasses() {
    this.removeClassFromPage(CLASS_NAME_GAME_STOPPED);
    this.removeClassFromPage(CLASS_NAME_GAME_OVER);
    this.removeClassFromPage(CLASS_NAME_GAME_IN_PROGRESS);
  }

  addClassToPage(className) {
    this.pageEl.classList.add(className);
  }

  removeClassFromPage(className) {
    this.pageEl.classList.remove(className);
  }

  setUpButtons() {
    document.getElementById('button-start').addEventListener('click', () => {
      this.start();
    });

    document.getElementById('button-restart').addEventListener('click', () => {
      this.restart();
    });

    document.getElementById('button-stop').addEventListener('click', () => {
      this.stop();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => new GameSession());
