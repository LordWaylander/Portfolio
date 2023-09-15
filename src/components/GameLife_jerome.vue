<template lang="">
  <div id="gameLife">
    <div id="buttonsGroup">
      <div id="divGen">
        <label>#</label>
        <input id="generation" type="text" disabled v-model="nbGeneration" />
      </div>
      <div id="buttons">
        <button type="button" name="button" id="start" @click="play()">
          <img src="/img/play-solid.png" alt="" />
        </button>
        <button type="button" name="button" id="pause" @click="pause()">
          <img src="/img/pause-solid.png" alt="" />
        </button>
        <button type="button" name="button" id="restart" @click="restart()">
          <img src="/img/rotate-right-solid.png" alt="" />
        </button>
      </div>
    </div>

    <div id="gameboard">
      <table id="gameBoard_table">
        <tbody></tbody>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      nbGeneration: 0,
      maxCol: 0,
      maxRow: 0,
      maxCell: 0,
      cellSizeInPx: 10,
      gameBoard: Array,
      nextBoard: Array,
      board: Object,
      cells: [],
      rafId: undefined,
      nIntervId: null,
      direction: [
        { x: -1, y: -1 },
        { x: 0, y: -1 },
        { x: 1, y: -1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: -1, y: 1 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ],
    };
  },
  mounted() {
    this.initialize();
    this.play();
  },
  beforeUnmount() {
    this.clearIntervalId();
    this.nbGeneration = 0;
  },
  methods: {
    initialize() {
      this.board = document.getElementById("gameBoard_table");
      this.reset();
      this.buildGameBoardTable();
    },
    reset() {
      this.maxCol = Math.floor(window.innerWidth / this.cellSizeInPx);
      this.maxRow = Math.floor(window.innerHeight / this.cellSizeInPx);
      this.maxCell = this.maxRow * this.maxCol;
      console.log("cellSizeInPx = ", this.cellSizeInPx);
      console.log("maxCol = ", this.maxCol);
      console.log("maxRow = ", this.maxRow);
      console.log("maxCell = ", this.maxCell);
      this.initRandomCells();
    },
    initRandomCells() {
      this.gameBoard = Array.from({ length: this.maxCell }, () =>
        Math.round(Math.random()),
      );
      this.nextBoard = Array.from({ length: this.maxCell }, () => 0);
    },
    buildGameBoardTable() {
      let ts1 = performance.now();

      this.board.textContent = "";

      const createCol = () => {
        return document.createElement("td");
      };

      const createRow = () => {
        return document.createElement("tr");
      };

      for (let j = 0; j < this.maxRow; j++) {
        const newRow = createRow();
        for (let i = 0; i < this.maxCol; i++) {
          const newCol = createCol();
          this.cells.push(newCol);
          newRow.appendChild(newCol);
        }
        this.board.appendChild(newRow);
      }
      let ts2 = performance.now();
      console.log("buildGameBoardTable : " + (ts2 - ts1));
      this.update();
    },
    update() {
      let ts1 = performance.now();
      let currentPosX = 0;
      let currentPosY = 0;

      for (let cellPos = 0; cellPos < this.maxCell; cellPos++) {
        const currentValue = this.gameBoard[cellPos];
        const isCurrentCellLive = currentValue === 1;

        const neighboursAlive = this.getAliveCellNeighboursAt(
          currentPosX,
          currentPosY,
        );

        const mustDie =
          isCurrentCellLive && (neighboursAlive < 2 || neighboursAlive > 3);
        const mustLive =
          (!isCurrentCellLive && neighboursAlive === 3) ||
          (isCurrentCellLive &&
            (neighboursAlive === 2 || neighboursAlive === 3));

        const newValue = mustDie ? 0 : mustLive ? 1 : 0;

        if (currentValue !== newValue) {
          this.updateDisplayCell(cellPos, newValue);
        }

        currentPosX++;
        if (currentPosX === this.maxCol) {
          currentPosX = 0;
          currentPosY++;
        }
      }

      this.nbGeneration++;

      //this.gameBoard = [...this.nextBoard]
      //this.gameBoard = Array().concat(this.nextBoard)
      //this.gameBoard = structuredClone(this.nextBoard)
      this.gameBoard = this.nextBoard.slice(0);
      let ts2 = performance.now();
      console.log("play : " + (ts2 - ts1));
    },
    getAliveCellNeighboursAt(x, y) {
      const getCellState = (x, y) => {
        if (x >= 0 && x < this.maxCol && y >= 0 && y < this.maxRow) {
          return this.gameBoard[x + y * this.maxCol];
        }
        return 0;
      };

      const count =
        getCellState(x + 1, y) +
        getCellState(x - 1, y) +
        getCellState(x + 1, y - 1) +
        getCellState(x - 1, y - 1) +
        getCellState(x, y - 1) +
        getCellState(x + 1, y + 1) +
        getCellState(x - 1, y + 1) +
        getCellState(x, y + 1);

      return count;
    },
    updateDisplayCell(cellPos, newValue) {
      this.nextBoard[cellPos] = newValue;

      this.cells[cellPos].setAttribute(
        "data-cell-is-alive",
        newValue.toString(),
      );
    },
    pause() {
      this.clearIntervalId();
      cancelAnimationFrame(this.rafId);
    },
    restart() {
      this.nbGeneration = 0;
      this.pause();
      this.reset();
      this.play();
    },
    play() {
      let self = this;
      if (!this.nIntervId) {
        this.nIntervId = setInterval(function () {
          self.rafId = window.requestAnimationFrame(self.update.bind(self));
        }, 400);
      }
    },
    clearIntervalId() {
      clearInterval(this.nIntervId);
      this.nIntervId = null;
    },
  },
};
</script>
<style lang="scss">
#gameLife {
  z-index: 1;
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
  #buttonsGroup {
    position: absolute;
    top: 0;
    z-index: 20;
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 1em;
    button {
      background: transparent;
      border: none;
      cursor: pointer;
      img {
        width: 25px;
        height: 25px;
      }
    }
  }
  /*#gameboard {
    position: relative;
    width: 100vw;
    top: 50%;
    left: -50%;
  }*/

  #gameBoard_table {
    border-collapse: collapse;
    width: 100%;
    height: 100%;
    td {
      border: 1px solid black;
      background-color: var(--color-background);
      width: 10px;
      height: 10px;
    }
    td[data-cell-is-alive="1"] {
      background-color: #b9bec6;
    }
    td[data-cell-is-alive="0"] {
      background-color: var(--color-background);
    }
    ::before {
      content: attr(data-parent);
    }
  }
}
</style>
