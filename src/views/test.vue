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
          <button @click="restart()">
            <img src="/img/rotate-right-solid.png" alt="restart game" />
          </button>
        </div>
      </div>
    <table id="gameBoard">
      <tbody>
        <tr v-for="row in nbRows">
          <td
            v-for="col in nbCols"
            :class="[
              gameBoard[row-1][col-1]? 'isAlive' : '',
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
      moyenneTime: 0,
      nbRows: 0,
      nbCols: 0,
      nbGeneration: 0,
      cellSizeInPx: 10,
      factorPopulation: 1.2,
      gameBoard: new Array(),
      nbVoisins: new Array(),
    };
  },
  created() {
    this.init()
  },
  mounted() {
    this.start() //~140ms
  },
  methods: {
    init() {
      let ts1 = performance.now()
      this.setVariables();
      this.createInitialCells();
      let ts2 = performance.now()
      console.log('init : '+(ts2-ts1));
    },
    setVariables() {
      this.nbCols = Math.floor(window.innerWidth / this.cellSizeInPx);
      this.nbRows = Math.floor(window.innerHeight / this.cellSizeInPx);
    },
    createInitialCells() {
      this.gameBoard = new Array(this.nbRows)
      this.nbVoisins = new Array(this.nbRows)

      for (let i = 0; i < this.nbRows; i++) {

        this.gameBoard[i] = new Array(this.nbCols)
        this.nbVoisins[i] = new Array(this.nbCols)
        this.nbVoisins[i].fill(0)

        for (let j = 0; j < this.nbCols; j++) {
          Math.floor(Math.random() * this.factorPopulation) != 0
                ? this.gameBoard[i][j] = 1
                : this.gameBoard[i][j] = 0
        }
      }
    },
    play() {
      let ts3 = performance.now()
      let cellsAlive = this.getCellsAlive()

      for (let i = 0; i < cellsAlive.length; i++) {
        const [row, col] = cellsAlive[i].split('/');
        this.getNumberNeighborsCell(parseInt(row), parseInt(col))
      }

      this.cellsWillBeAliveAtNextIteration()
      let ts4 = performance.now()
      this.moyenneTime += (ts4-ts3)
    },
    getCellsAlive(){
      let cellsAlive = []
      for (let i = 0; i < this.nbRows; i++) {
        for (let j = 0; j < this.nbCols; j++) {
          if(this.gameBoard[i][j] === 1){
            cellsAlive.push(i+'/'+j)
          }
        }
      }
      return cellsAlive
    },
    getNumberNeighborsCell(row, col){
      const maxX = this.nbCols - 1;
      const maxY = this.nbRows - 1;

      if (col > 0) this.nbVoisins[row][col-1]++; //left
      if (col < maxX) this.nbVoisins[row][col+1]++; //right
      if (row > 0) this.nbVoisins[row-1][col]++; //top
      if (row > 0 && col > 0) this.nbVoisins[row-1][col-1]++; //topLeft
      if (row > 0 && col < maxX) this.nbVoisins[row-1][col+1]++; //topRight
      if (row < maxY) this.nbVoisins[row+1][col]++; //bottom
      if (row < maxY && col > 0) this.nbVoisins[row+1][col-1]++; //bottomLeft
      if (row < maxY && col < maxX) this.nbVoisins[row+1][col+1]++; //bottomRight
    },
    cellsWillBeAliveAtNextIteration(){
      for (let i = 0; i < this.nbRows; i++) {
        for (let j = 0; j < this.nbCols; j++) {
          let isAlive = this.gameBoard[i][j] === 1;
          const needLive = (isAlive &&(this.nbVoisins[i][j] === 2 || this.nbVoisins[i][j] === 3)) || (!isAlive && this.nbVoisins[i][j] === 3);
          this.gameBoard[i][j] = needLive ? 1 : 0;
        }
        this.nbVoisins[i].fill(0)
      }
      this.nbGeneration++
    },
    start() {
      if (!this.nIntervId) {
        this.nIntervId = setInterval(this.play, 250);
      }
    },
    pause() {
      console.log('temps moyen d\'excecution : '+this.moyenneTime/this.nbGeneration);
      this.clearnIntervId();
    },
    restart() {
      this.clearnIntervId();
      this.nbGeneration = 0;
      this.init();
      this.start();
    },
    clearnIntervId() {
      clearInterval(this.nIntervId);
      this.nIntervId = null;
    },
    defineAlive(e) {
      const row = parseInt(e.target.attributes["data-row"].value);
      const col = parseInt(e.target.attributes["data-col"].value);

      if (this.gameBoard[row][col]) {
        this.gameBoard[row][col] = 0;
        e.target.classList.remove("isAlive");
      } else {
        this.gameBoard[row][col] = 1;
        e.target.classList.add("isAlive");
      }
    },
  },

};
</script>
<style lang="scss" scoped>
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
  position: fixed;
  width: 100vw;
  height: 100vh;
  tr {
    td.isAlive {
      background-color: #b9bec6 !important;
    }
  }
}
</style>
