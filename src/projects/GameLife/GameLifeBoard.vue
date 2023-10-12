<template lang="">
  <table id="gameBoard">
    <tbody>
      <tr v-for="row in nbRows">
        <td
          v-for="col in nbCols"
          :class="[cells[col - 1 + (row - 1) * nbCols] != 0 ? 'isAlive' : '']"
          :data-row="row - 1"
          :data-col="col - 1"
          @click="defineAlive($event)"
        ></td>
      </tr>
    </tbody>
  </table>
</template>
<script>
export default {
  props: {
    startApp: {
      default: false,
    },
    pauseApp: {
      default: false,
    },
    restartApp: {
      default: false,
    },
  },
  watch: {
    startApp: {
      handler(value) {
        if (value) {
          this.start(); //~96.2ms
        }
      },
    },
    pauseApp: {
      handler(value) {
        if (value) {
          console.log(
            "temps moyen d'excecution : " +
              this.moyenneTime / this.nbGeneration,
          );
          this.pause();
        }
      },
    },
    restartApp: {
      handler(value) {
        if (value) {
          this.moyenneTime = 0;
          this.restart();
        }
      },
    },
  },
  data() {
    return {
      moyenneTime: 0,
      nbGeneration: 0,
      nbCols: 0,
      nbRows: 0,
      cellSizeInPx: 10,
      factorPopulation: 1.2,
      gameBoard: new Array(),
      nbVoisins: new Array(),
      matricePosition: new Array(),
      cells: new Array(),
      nIntervId: null,
    };
  },
  created() {
    this.init();
  },
  mounted() {
    this.gameBoard = Array.from(document.getElementsByTagName("td"));
    this.start();
  },
  beforeUnmount() {
    this.clearnIntervId();
    this.nbGeneration = 0;
  },
  methods: {
    init() {
      let ts1 = performance.now();
      this.setVariables();
      console.log("rows : " + this.nbRows);
      console.log("cols : " + this.nbCols);
      let ts2 = performance.now();
      console.log("init : " + (ts2 - ts1));
    },
    setVariables() {
      this.nbCols = Math.floor(window.innerWidth / this.cellSizeInPx);
      this.nbRows = Math.floor(window.innerHeight / this.cellSizeInPx);
      this.nbVoisins = new Array(this.nbRows * this.nbCols).fill(0);
      this.matricePosition = [
        -1, // left
        +1, // right
        -this.nbCols, // Top
        -(this.nbCols + 1), // TopLeft
        -(this.nbCols - 1), // TopRight
        +this.nbCols, // bottom
        +(this.nbCols - 1), // BottomLeft
        +(this.nbCols + 1), // BottomRight
      ];
      for (let i = 0; i < this.nbRows * this.nbCols; i++) {
        this.cells.push(Math.floor(Math.random() * this.factorPopulation));
      }
    },
    play() {
      let ts1 = performance.now();

      const cellsAlives = Array.from(
        document.getElementsByClassName("isAlive"),
      );
      cellsAlives.forEach((cell) => {
        this.getNumberNeighborsCell(cell);
      });

      const cellWhoWillBeAlives = this.checkCellules();
      this.nbVoisins.fill(0);

      this.updateFront(cellWhoWillBeAlives);

      let ts2 = performance.now();
      this.moyenneTime += ts2 - ts1;
      //console.log('play : '+(ts2-ts1));
    },
    getNumberNeighborsCell(cellule) {
      const row = parseInt(cellule.dataset.row);
      const col = parseInt(cellule.dataset.col);
      const index = col + row * this.nbCols;
      const maxX = this.nbCols - 1;
      const maxY = this.nbRows - 1;

      if (col > 0) this.nbVoisins[index + this.matricePosition[0]]++;
      if (col < maxX) this.nbVoisins[index + this.matricePosition[1]]++;
      if (row > 0) this.nbVoisins[index + this.matricePosition[2]]++;
      if (row > 0 && col > 0) this.nbVoisins[index + this.matricePosition[3]]++;
      if (row > 0 && col < maxX)
        this.nbVoisins[index + this.matricePosition[4]]++;
      if (row < maxY) this.nbVoisins[index + this.matricePosition[5]]++;
      if (row < maxY && col > 0)
        this.nbVoisins[index + this.matricePosition[6]]++;
      if (row < maxY && col < maxX)
        this.nbVoisins[index + this.matricePosition[7]]++;
    },
    checkCellules() {
      let cellWhoWillBeAlives = [];

      for (let i = 0; i < this.gameBoard.length; i++) {
        let isAlive = this.gameBoard[i].classList.contains("isAlive") === true;
        if (
          (!isAlive && this.nbVoisins[i] === 3) ||
          (isAlive && (this.nbVoisins[i] === 2 || this.nbVoisins[i] === 3))
        ) {
          cellWhoWillBeAlives.push(this.gameBoard[i]);
        }
      }
      return cellWhoWillBeAlives;
    },
    updateFront(cellWhoWillBeAlives) {
      const cellsAlives = Array.from(
        document.getElementsByClassName("isAlive"),
      );
      cellsAlives.forEach((cell) => {
        cell.classList.remove("isAlive");
      });

      cellWhoWillBeAlives.forEach((cell) => {
        cell.classList.add("isAlive");
      });

      this.$emit("updateNbGeneration", this.nbGeneration++);
    },
    start() {
      if (!this.nIntervId) {
        this.nIntervId = setInterval(this.play, 150);
      }
    },
    pause() {
      this.clearnIntervId();
    },
    restart() {
      this.clearnIntervId();
      this.cells = new Array();
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
      this.gameBoard[col + row * this.nbCols].classList.toggle("isAlive");
    },
  },
};
</script>
<style lang="scss" scoped></style>
