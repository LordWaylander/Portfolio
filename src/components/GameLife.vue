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

    <div id="gameboard" @click="tt($event)">
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
      cellSizeInEm: 10,
      gameBoard: Array,
      nextBoard: Array,
      board: Object,
      cells: [],
      started: false,
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
  created() {},
  mounted() {
    this.initialize();
    this.play();
  },
  beforeUnmount() {
    this.clearnIntervId();
    this.nbGeneration = 0;
  },
  methods: {
    initialize() {
      this.board = document.getElementById("gameBoard_table");
      this.reset();
      this.buildGameBoardTable();
      
    },
    initRandomCells() {
      this.gameBoard = Array.from({ length: this.maxCell }, () =>
        Math.round(Math.random()),
      );
      this.nextBoard = Array.from({ length: this.maxCell }, () =>
        0,
      );
    },
    reset() {
      this.maxCol = Math.floor(window.innerWidth / this.cellSizeInEm);
      this.maxRow = Math.floor(window.innerHeight / this.cellSizeInEm);
      this.maxCell = this.maxRow * this.maxCol;
      //console.log("cellSizeInEm = ", this.cellSizeInEm);
      //console.log("maxCol = ", this.maxCol);
      //console.log("maxRow = ", this.maxRow);
      //console.log("maxCell = ", this.maxCell);
      this.initRandomCells();
    },
    buildGameBoardTable() {

      this.board.textContent = "";

      const createCol = (i,j) => {
        const newCol = document.createElement("td");
        return newCol;
      };

      const createRow = () => {
        return document.createElement("tr");
      };

      for (let j = 0; j < this.maxRow; j++) {
        const newRow = createRow();
        for (let i = 0; i < this.maxCol; i++) {
          const newCol = createCol(i,j);
          this.cells.push(newCol);
          newRow.appendChild(newCol);
        }
        this.board.appendChild(newRow);
      }
    },
    
    update() {

      //let cellPos = 0;
      let currentPosX = 0;
      let currentPosY = 0;

      for (let cellPos = 0; cellPos < this.maxCell; cellPos++) {
        
        const currentValue = this.gameBoard[cellPos];
        const isCurrentCellLive = currentValue === 1;

        const neighboursAlive = this.getAliveCellNeighboursAt(
            currentPosX,
            currentPosY,
        );

        const itMustDie = isCurrentCellLive && (neighboursAlive < 2 || neighboursAlive > 3);
        const itMustLive = (!isCurrentCellLive && neighboursAlive === 3) ||(isCurrentCellLive && (neighboursAlive === 2 || neighboursAlive === 3));

        const newValue = itMustDie ? 0 : itMustLive ? 1 : 0;

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
      this.gameBoard = this.nextBoard.slice(0)
      console.log(this.started);

      if (!this.started) {
        console.log('NOT START');
        cancelAnimationFrame(this.rafId);
        return;
      }
    },
    updateDisplayCell(cellPos, newValue) {
      this.nextBoard[cellPos] = newValue;

      this.cells[cellPos].setAttribute(
        "data-cell-is-alive",
        newValue.toString(),
      );
    },
    getAliveCellNeighboursAt(x, y) {
      const getCellState = ((x, y) => {
        if ((x >= 0 && x < this.maxCol) && (y >= 0 && y < this.maxRow)) {
          return this.gameBoard[x + y * this.maxCol]
        }
        return 0;
      })

      const count = getCellState(x+1 , y) + getCellState(x-1 , y) + 
                    getCellState(x+1 , y-1) + getCellState(x-1 , y-1) + getCellState(x , y-1) +
                    getCellState(x+1 , y+1) + getCellState(x-1 , y+1) + getCellState(x , y+1)
      
      return count;
      
    },
    start() {
      
      if (!this.nIntervId) {
        this.nIntervId = setInterval(this.update(), 250);
      }
    
    //this.play();
    },
    pause() {
      console.log("pause");
      this.started = false;
      cancelAnimationFrame(this.rafId);
      this.reset();
    },
    restart() {
        if (this.started) {
            this.stop();
        }
            this.initialize();
    },
    play() {
      console.log('PLAY');
        this.started = true;
        this.rafId = window.requestAnimationFrame(this.update.bind(this))

    },
    clearnIntervId() {
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
