<template lang="">
  <table id="gameBoard">
    <tbody id="gameLife"></tbody>
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
          this.start(); //~120ms
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
      nbRows: 0,
      nbCols: 0,
      pixelSize: 10,
      nbGeneration: 0,
      moyenneTime: 0,
      factorPopulation: 1.2,
      nIntervId: null,
      game: {
        etatDom: new Array(),
        nbVoisins: new Array(),
      },
    };
  },
  created() {},
  mounted() {
    this.init();
    this.start();
  },
  beforeUnmount() {
    this.clearnIntervId();
    this.nbGeneration = 0;
  },
  methods: {
    init() {
        let table = document.getElementById('gameLife')
        table.addEventListener('click', (e) => {
            e.target.classList.toggle('isAlive');
        });

      let ts1 = performance.now();
      this.setVariables();
      this.createTable();
      let ts2 = performance.now();
      console.log("init : " + (ts2 - ts1));
      console.log("rows : " + this.nbRows);
      console.log("cols : " + this.nbCols);
    },
    setVariables() {
      this.nbRows = Math.floor(window.innerHeight / this.pixelSize);
      this.nbCols = Math.floor(window.innerWidth / this.pixelSize);
    },

    createTable() {
      let tbody = document.querySelector("tbody");
      let tableString = "";
      this.game.etatDom = new Array(this.nbRows);
      this.game.nbVoisins = new Array(this.nbRows);
      for (let i = 0; i < this.nbRows; i++) {
        this.game.etatDom[i] = new Array(this.nbCols);
        this.game.nbVoisins[i] = new Array(this.nbCols).fill(0);
        tableString += "<tr>";
        for (let j = 0; j < this.nbCols; j++) {
          const isAlive = Math.floor(Math.random() * this.factorPopulation);
          tableString += `<td class="${
            isAlive ? "isAlive" : ""
          }" data-row="${i}" data-col="${j}">`;
        }
        tableString += "</tr>";
      }
      tbody.innerHTML = tableString;

      const allCells = Array.from(document.getElementsByTagName("td"));
      allCells.forEach((cell) => {
        this.game.etatDom[cell.dataset.row][cell.dataset.col] = cell;
      });
    },
    play() {
      let ts1 = performance.now();

      const cellsAlives = Array.from(
        document.getElementsByClassName("isAlive"),
      );
      cellsAlives.forEach((cell) => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        this.getNumberNeighborsCell(row, col);
      });

      const cellWhoWillBeAlives = this.checkCellules();
      for (let i = 0; i < this.game.nbVoisins.length; i++) {
        this.game.nbVoisins[i].fill(0);
      }
      this.updateFront(cellWhoWillBeAlives);
      let ts2 = performance.now();
      this.moyenneTime += ts2 - ts1;
      //console.log('play : '+(ts2-ts1));
    },

    getNumberNeighborsCell(row, col) {
      /**
       * Pour chaque cell vivantes, incrémente ses voisines de +1
       */
      // Traitement de la ligne précédente
      if (row - 1 >= 0) {
        if (col - 1 >= 0) {
          this.game.nbVoisins[row - 1][col - 1]++;
        }
        if (col + 1 < this.nbCols) {
          this.game.nbVoisins[row - 1][col + 1]++;
        }
        this.game.nbVoisins[row - 1][col]++;
      }
      // Traitement de la ligne en cours
      if (col - 1 >= 0) {
        this.game.nbVoisins[row][col - 1]++;
      }
      if (col + 1 < this.nbCols) {
        this.game.nbVoisins[row][col + 1]++;
      }
      // Traitement de la ligne suivante
      if (row + 1 < this.nbRows) {
        if (col - 1 >= 0) {
          this.game.nbVoisins[row + 1][col - 1]++;
        }
        if (col + 1 < this.nbCols) {
          this.game.nbVoisins[row + 1][col + 1]++;
        }
        this.game.nbVoisins[row + 1][col]++;
      }
    },

    checkCellules() {
      /**
       * pour tute cell, il faut verifier si elles doivent vivre ou crever
       */
      let cellWhoWillBeAlives = [];

      for (let i = 0; i < this.game.etatDom.length; i++) {
        for (let j = 0; j < this.game.etatDom[i].length; j++) {
          let isAlive = this.game.etatDom[i][j].classList.contains("isAlive");
          if (
            (!isAlive && this.game.nbVoisins[i][j] === 3) ||
            (isAlive &&
              (this.game.nbVoisins[i][j] === 2 ||
                this.game.nbVoisins[i][j] === 3))
          ) {
            cellWhoWillBeAlives.push(this.game.etatDom[i][j]);
          }
        }
      }
      return cellWhoWillBeAlives;
    },

    updateFront(cellWhoWillBeAlives) {
      const cellsAlives = Array.from(
        document.getElementsByClassName("isAlive"),
      );

      for (let i = 0; i < cellsAlives.length; i++) {
        cellsAlives[i].classList.remove("isAlive");
      }
      for (let i = 0; i < cellWhoWillBeAlives.length; i++) {
        cellWhoWillBeAlives[i].classList.add("isAlive");
      }
      this.nbGeneration++;
      this.$emit("updateNbGeneration", this.nbGeneration++);
    },
    start() {
      if (!this.nIntervId) {
        this.nIntervId = setInterval(this.play, 250);
      }
    },
    pause() {
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
    }
  },
};
</script>
<style lang="scss" scoped>
</style>
