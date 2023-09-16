<template lang="">
  <div id="gameLife">
    <div id="buttonsGroup">
      <div>
        <label for="generation">#</label>
        <input
          type="text"
          name="generation"
          id="generation"
          disabled
          v-model="nbGeneration"
        />
      </div>
      <div>
        <button @click="play()">Play</button>
        <button @click="pause()">Pause</button>
        <button @click="reset()">Reset</button>
      </div>
    </div>
    <table id="gameBoard">
      <tbody>
        <tr v-for="row in nbRows">
          <td
            v-for="col in nbCols"
            :class="[
              initialTable[col - 1 + (row - 1) * nbCols].isAlive
                ? 'isAlive'
                : '',
            ]"
            :data-row="row - 1"
            :data-col="col - 1"
            @click="defineAlive($event)"
          ></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      nbGeneration: 0,
      nbCols: 0,
      nbRows: 0,
      nbCells: 0,
      cellSizeInPx: 10,
      factorPopulation: 1.1,
      initialTable: new Array(),
      nIntervId: null,
    };
  },
  created() {
    this.init();
  },
  mounted() {
    this.start();
  },
  beforeUnmount() {
    this.clearnIntervId();
    this.nbGeneration = 0;
  },
  methods: {
    init() {
      this.setVariables();
      this.createInitialCells();
    },
    setVariables() {
      this.nbCols = Math.floor(window.innerWidth / this.cellSizeInPx);
      this.nbRows = Math.floor(window.innerHeight / this.cellSizeInPx);
      this.nbCells = this.nbCols * this.nbRows;
      console.log("cellSizeInPx = ", this.cellSizeInPx);
      console.log("nbCols = ", this.nbCols);
      console.log("nbRows = ", this.nbRows);
      console.log("nbCells = ", this.nbCells);
    },
    createInitialCells() {
      let ts1 = performance.now();

      for (let i = 0; i < this.nbRows; i++) {
        for (let j = 0; j < this.nbCols; j++) {
          const cellsProperties = {
            row: i,
            col: j,
            isAlive:
              Math.floor(Math.random() * this.factorPopulation) != 0
                ? true
                : false,
            nbVoisins: 0,
          };
          this.initialTable.push(cellsProperties);
        }
      }

      let ts2 = performance.now();
      console.log("createInitialCells : " + (ts2 - ts1)); // moyenne 77.8ms (70-85)
    },
    play() {
      let ts1 = performance.now();
      /**
       * MOYENNE : 361.5 ms
       */
      let copyInitialTable = JSON.parse(JSON.stringify(this.initialTable));

      for (let i = 0; i < copyInitialTable.length; i++) {
        const cell = copyInitialTable[i];
        const previousState = cell.isAlive;
        const neighboursAlive = this.getNeighboursAlive(cell.row, cell.col);
        const mustDie =
          cell.isAlive && (neighboursAlive < 2 || neighboursAlive > 3);
        const mustLive =
          (!cell.isAlive && neighboursAlive === 3) ||
          (cell.isAlive && (neighboursAlive === 2 || neighboursAlive === 3));
        const nextState = mustDie ? false : mustLive ? true : false;

        if (previousState !== nextState) {
          copyInitialTable[cell.col + cell.row * this.nbCols].isAlive =
            nextState;
        }
      }
      this.initialTable = copyInitialTable;

      /**
       * MOYENNE : 389.1 ms -> 391.4 ms ...
       * */
      /*
      let cellWhoWillLive = []
      copyInitialTable.forEach(cell => {
        const neighboursAlive = this.getNeighboursAlive(cell.row, cell.col);
        copyInitialTable[cell.col + cell.row*this.nbCols].nbVoisins = neighboursAlive

        const mustLive = (!cell.isAlive && neighboursAlive === 3) || (cell.isAlive && (neighboursAlive === 2 || neighboursAlive === 3));
        const nextState = mustLive ? true : false ;

        if(nextState === true) {
            cellWhoWillLive.push(copyInitialTable[cell.col + cell.row*this.nbCols])
        }
      });
      this.updateFront(cellWhoWillLive)
      */

      let ts2 = performance.now();
      console.log("play : " + (ts2 - ts1));
    },
    updateFront(cellWhoWillLive) {
      for (const cell of this.initialTable) {
        cell.isAlive = false;
      }
      for (const cell of cellWhoWillLive) {
        this.initialTable[cell.col + cell.row * this.nbCols].isAlive = true;
      }

      this.nbGeneration++;
    },
    getNeighboursAlive(row, col) {
      const getCellState = (row, col) => {
        if (
          row >= 0 &&
          row < this.nbRows &&
          col >= 0 &&
          col < this.nbCols &&
          this.initialTable[col + row * this.nbCols].isAlive === true
        ) {
          return 1;
        }
        return 0;
      };

      const count =
        getCellState(row + 1, col) +
        getCellState(row - 1, col) +
        getCellState(row + 1, col - 1) +
        getCellState(row - 1, col - 1) +
        getCellState(row, col - 1) +
        getCellState(row + 1, col + 1) +
        getCellState(row - 1, col + 1) +
        getCellState(row, col + 1);

      return count;
    },
    start() {
      if (!this.nIntervId) {
        this.nIntervId = setInterval(this.play, 400);
      }
      //this.play()
    },
    pause() {
      this.clearnIntervId();
    },
    reset() {
      this.clearnIntervId();
      this.nbGeneration = 0;
      this.createInitialCells();
    },
    clearnIntervId() {
      clearInterval(this.nIntervId);
      this.nIntervId = null;
    },
    defineAlive(e) {
      const row = parseInt(e.target.attributes["data-row"].value);
      const col = parseInt(e.target.attributes["data-col"].value);

      if (this.initialTable[col + row * this.nbCols].isAlive) {
        this.initialTable[col + row * this.nbCols].isAlive = false;
        e.target.classList.remove("isAlive");
      } else {
        this.initialTable[col + row * this.nbCols].isAlive = true;
        e.target.classList.add("isAlive");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
#gameLife {
  position: absolute;
  width: 100vw;
  height: 100vh;
  #buttonsGroup {
    position: absolute;
  }
  #gameBoard {
    width: 100vw;
    height: 100vh;
    tr {
      td {
        span {
          display: block;
        }
      }
      td.isAlive {
        background-color: #b9bec6 !important;
      }
    }
  }
}
</style>
