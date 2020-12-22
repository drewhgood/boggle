const GRID_SIZE = 4;
const GAME_DURATION = 2;
const GAME_INTERVAL = 1000;

const ALPHABET = [...'abcdefghijklmnopqrstuvwxyz'];
const ALPHABET_RANGE = [0, ALPHABET.length - 1];

const ID_BOARD_GAME = 'board';
const ID_GAME_TIMER = 'timer';

const CLASS_NAME_GAME_TILE = 'tile';
const CLASS_NAME_GAME_IN_PROGRESS = 'game--in-progress';
const CLASS_NAME_GAME_OVER = 'game--over';

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
        console.log(this.onTimeExpired);
        this.onTimeExpired();
      }
    } else {
      this.decrementTime();
      this.renderTime();
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
}

class GameBoard {
  constructor() {
    this.tileCount = GRID_SIZE * GRID_SIZE;
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
      element.style.width = '25%';
      element.style.height = '25%';
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
    this.timer = new GameTimer(() => this.stop());
    this.board = new GameBoard();
    this.pageEl = document.body;
    this.setUpButtons();
  }

  start() {
    this.restart();
    this.timer.start();
    this.addClassToPage(CLASS_NAME_GAME_IN_PROGRESS);
  }

  restart() {
    this.timer.restart();
    this.board.restart();
    this.removeClassFromPage(CLASS_NAME_GAME_OVER);
    this.removeClassFromPage(CLASS_NAME_GAME_IN_PROGRESS);
  }

  stop() {
    this.timer.stop();
    this.addClassToPage(CLASS_NAME_GAME_OVER);
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
  }
}

const startGame = () => {
  new GameSession();
};

document.addEventListener('DOMContentLoaded', startGame);
