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
        <button @click="start()">
          <img src="/img/play-solid.png" alt="play game" />
        </button>
        <button @click="pause()">
          <img src="/img/pause-solid.png" alt="pause game" />
        </button>
      </div>
    </div>
    <table id="gameBoard">
      <tbody>
        <tr v-for="row in nbRows">
          <td
            v-for="col in nbCols"
            :class="[
              gameBoard[col - 1 + (row - 1) * nbCols].isAlive
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
      cellSizeInPx: 10,
      factorPopulation: 1.2,
      gameBoard: new Array(),
      matricePosition: new Array(),
      nIntervId: null,
      isLoading: true, // ?
    };
  },
  created() {
    this.init();
  },
  mounted() {
    //this.start();
  },
  beforeUnmount() {
    this.clearnIntervId();
    this.nbGeneration = 0;
  },
  methods: {
    init() {

      let ts1 = performance.now();

      this.setVariables();
      this.createInitialCells();
      this.isLoading = false

      let ts2 = performance.now();
      console.log("init : " + (ts2 - ts1)); // moyenne 79.2 ms
    },
    setVariables() {

      this.nbCols = Math.floor(window.innerWidth / this.cellSizeInPx);
      this.nbRows = Math.floor(window.innerHeight / this.cellSizeInPx);
      this.matricePosition = [
        -1, // left
        +1, // right
        -this.nbCols, // Top
        -(this.nbCols + 1), // TopLeft
        -(this.nbCols - 1), // TopRight
        +this.nbCols, // bottom
        +(this.nbCols - 1), // BottomLeft
        +(this.nbCols + 1), // BottomRight
      ]
      console.log("cellSizeInPx = ", this.cellSizeInPx);
      console.log("nbCols = ", this.nbCols);
      console.log("nbRows = ", this.nbRows);
      console.log("matricePosition ", this.matricePosition);
    },
    createInitialCells() {
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
          this.gameBoard.push(cellsProperties);
        }
      }
    },
    play() {
      let ts1 = performance.now();

      let cellsAlive = this.getCellsAlive();

      cellsAlive.forEach((cell) => {
        this.getNumberNeighborsCell(cell);
      });

      let cellulesAlive = this.checkCellules();

      this.updateFront(cellulesAlive);

      let ts2 = performance.now();
      console.log("play : " + (ts2 - ts1)); 
      /**
       * // moyenne 50 gen, 
       * ancien algo : 156.22
       * new algo : 140.22
       */
      this.totalTime += (ts2 - ts1)
    },
    getCellsAlive() {
      return this.gameBoard.filter((cell) => {
        return cell.isAlive === true;
      });
    },
    getNumberNeighborsCell(cellule) {
      
      const row = cellule.row
      const col = cellule.col
      const index = col + row* this.nbCols;
      const maxX = (this.nbCols - 1);
      const maxY = (this.nbRows -1);

      if (col > 0) this.gameBoard[index + this.matricePosition[0]].nbVoisins++ 
      if (col < maxX) this.gameBoard[index + this.matricePosition[1]].nbVoisins++
      if (row > 0) this.gameBoard[index + this.matricePosition[2]].nbVoisins++
      if (row > 0 && col > 0) this.gameBoard[index + this.matricePosition[3]].nbVoisins++
      if (row > 0 && col < maxX) this.gameBoard[index + this.matricePosition[4]].nbVoisins++
      if (row < maxY) this.gameBoard[index + this.matricePosition[5]].nbVoisins++
      if (row < maxY && col > 0) this.gameBoard[index + this.matricePosition[6]].nbVoisins++
      if (row < maxY && col < maxX) this.gameBoard[index + this.matricePosition[7]].nbVoisins++
    },
    checkCellules() {
      let cellulesAlive = [];
      this.gameBoard.forEach((cell) => {
        let celluleNoire = cell.isAlive === true;
        if (
          (!celluleNoire && cell.nbVoisins == 3) ||
          (celluleNoire && (cell.nbVoisins == 2 || cell.nbVoisins == 3))
        ) {
          cellulesAlive.push(cell);
        }
      });
      return cellulesAlive;
    },
    updateFront(cellulesAlive) {

      for (const cell of this.gameBoard) {
        cell.isAlive = false;
        cell.nbVoisins = 0;
      }

      for (const cell of cellulesAlive) {
        this.gameBoard[cell.col + cell.row * this.nbCols].isAlive = true;
      }

      this.nbGeneration++;
    },
    start() {
      if (!this.nIntervId) {
        this.nIntervId = setInterval(this.play, 250);
      }
      //this.play()
    },
    pause() {
      this.clearnIntervId();
    },
    clearnIntervId() {
      clearInterval(this.nIntervId);
      this.nIntervId = null;
    },
    defineAlive(e) {
      const row = parseInt(e.target.attributes["data-row"].value);
      const col = parseInt(e.target.attributes["data-col"].value);

      if (this.gameBoard[col + row * this.nbCols].isAlive) {
        this.gameBoard[col + row * this.nbCols].isAlive = false;
        e.target.classList.remove("isAlive");
      } else {
        this.gameBoard[col + row * this.nbCols].isAlive = true;
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
    top: 0;
    z-index: 20;
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 1em;
    input {
      width: 25%;
    }
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
