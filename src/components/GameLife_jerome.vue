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
        <button type="button" name="button" id="pause" @click="stop()">
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
      gameBoard: null,
      board: [],
      nextBoard: [],
      updateCellsIndex: null,
      cells: [],
      started: false,
      rafId: undefined,
      cellSizeInPx: 10,
    };
  },
  mounted() {
    this.init();
    //this.play();
  },
  beforeUnmount() {
    this.clearIntervalId();
    this.nbGeneration = 0;
  },
  methods: {
    buildGameBoardTable() {
      this.board.textContent = "";
      this.cells = [];

      const createCol = () => {
        const newCol = document.createElement("td");
        newCol.setAttribute("data-cell-is-alive", "0");
        return newCol;
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
    },
    initRandomCells() {
      this.gameBoard = this.gameBoard.map(() => Math.round(Math.random()));
    },
    reset() {
      this.gameBoard = this.gameBoard.fill(0);
      this.initRandomCells();
      this.nextBoard = this.gameBoard.slice(0);
      this.updateCellsIndex = new Set([...this.gameBoard.keys()]);
      this.buildGameBoardTable();
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
      this.cells[cellPos].setAttribute(
        "data-cell-is-alive",
        newValue.toString(),
      );
    },
    update() {
      let ts1 = performance.now();
      const delta = 1 / this.maxCol;
      const nextChanges = new Set(this.updateCellsIndex);
      for (let cellPos of this.updateCellsIndex) {
        const currentValue = this.gameBoard[cellPos];
        const isCurrentCellLive = currentValue === 1;

        const currentPosX = cellPos % this.maxCol;
        const currentPosY = Math.floor(cellPos * delta);

        const neighboursAlive = this.getAliveCellNeighboursAt(
          currentPosX,
          currentPosY,
        );

        const itMustDie =
          isCurrentCellLive && (neighboursAlive < 2 || neighboursAlive > 3);
        const itMustLive =
          (!isCurrentCellLive && neighboursAlive === 3) ||
          (isCurrentCellLive &&
            (neighboursAlive === 2 || neighboursAlive === 3));

        const newValue = itMustDie ? 0 : itMustLive ? 1 : currentValue;

        if (currentValue !== newValue) {
          this.updateDisplayCell(cellPos, newValue);
          nextChanges.add(cellPos);

          this.addNeighbourToNextChanges(
            currentPosX + 1,
            currentPosY,
            nextChanges,
          );
          this.addNeighbourToNextChanges(
            currentPosX - 1,
            currentPosY,
            nextChanges,
          );
          this.addNeighbourToNextChanges(
            currentPosX + 1,
            currentPosY - 1,
            nextChanges,
          );
          this.addNeighbourToNextChanges(
            currentPosX - 1,
            currentPosY - 1,
            nextChanges,
          );
          this.addNeighbourToNextChanges(
            currentPosX,
            currentPosY - 1,
            nextChanges,
          );
          this.addNeighbourToNextChanges(
            currentPosX + 1,
            currentPosY + 1,
            nextChanges,
          );
          this.addNeighbourToNextChanges(
            currentPosX - 1,
            currentPosY + 1,
            nextChanges,
          );
          this.addNeighbourToNextChanges(
            currentPosX,
            currentPosY + 1,
            nextChanges,
          );
        }
        this.nextBoard[cellPos] = newValue;
      }

      this.gameBoard = this.nextBoard.slice(0);
      this.updateCellsIndex = nextChanges;

      if (!this.started) {
        cancelAnimationFrame(this.rafId);
        return;
      }
      let ts2 = performance.now();
      console.log("update : " + (ts2 - ts1));

      this.rafId = window.requestAnimationFrame(this.update.bind(this));
    },
    play() {
      this.started = true;
      this.rafId = window.requestAnimationFrame(this.update.bind(this));
    },

    stop() {
      this.started = false;
      cancelAnimationFrame(this.rafId);
      //clearInterval(this.rafId)
    },
    restart() {
      this.stop();
      this.reset();
    },

    init() {
      this.maxCol = Math.floor(window.innerWidth / this.cellSizeInPx);
      this.maxRow = Math.floor(window.innerHeight / this.cellSizeInPx);
      this.maxCell = this.maxRow * this.maxCol;

      const r = document.querySelector(":root");
      r.style.setProperty("--cell-size", `${this.cellSizeInPx}px`);

      this.gameBoard = new Array(this.maxCell);

      this.board = document.getElementById("gameBoard_table");
      this.reset();
    },

    addNeighbourToNextChanges(x, y, nextChanges) {
      if (x >= 0 && x < this.maxCol && y >= 0 && y < this.maxRow) {
        nextChanges.add(x + y * this.maxCol);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
td[data-cell-is-alive="1"] {
  background-color: #b9bec6;
}
td[data-cell-is-alive="0"] {
  background-color: var(--color-background);
}
#gameLife {
  td[data-cell-is-alive="1"] {
    background-color: #b9bec6;
  }
  td[data-cell-is-alive="0"] {
    background-color: var(--color-background);
  }
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
    td[data-cell-is-alive="1"] {
      background-color: #b9bec6;
    }
    td[data-cell-is-alive="0"] {
      background-color: var(--color-background);
    }
  }
  td[data-cell-is-alive="1"] {
    background-color: #b9bec6;
  }
  td[data-cell-is-alive="0"] {
    background-color: var(--color-background);
  }
}
</style>
