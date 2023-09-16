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
        <tbody v-html="arrayHtml"></tbody>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      nbRow: 151,
      nbCol: 91,
      nbGeneration: 0,
      nIntervId: null,
      tableJeu: new Object(),
      arrayHtml: null,
      dataTable: null,
      cellSizeInPx: 10,
    };
  },
  created() {
    this.setVariables();
    this.setupTable();
  },
  mounted() {
    this.setEtat();
    //this.start();
  },
  beforeUnmount() {
    this.clearnIntervId();
    this.nbGeneration = 0;
  },
  methods: {
    setVariables() {
      this.nbCol = 300; //Math.floor(window.innerWidth / this.cellSizeInPx);
      this.nbRow = 300; //Math.floor(window.innerHeight / this.cellSizeInPx);
      console.log("cellSizeInPx = ", this.cellSizeInPx);
      console.log("nbCol = ", this.nbCol);
      console.log("nbRow = ", this.nbRow);
      console.log("nbCells = ", this.nbCol * this.nbRow);
    },
    setupTable() {
      let ts1 = performance.now();
      let tableau = "";

      this.tableJeu.etat = new Array(this.nbRow);
      this.tableJeu.nbVoisins = new Array();

      for (let i = 0; i < this.nbRow; i++) {
        tableau += "<tr>";
        this.tableJeu.etat[i] = new Array(this.nbCol);
        this.tableJeu.nbVoisins[i] = new Array(this.nbCol);
        this.tableJeu.nbVoisins[i].fill(0);
        for (let j = 0; j < this.nbCol; j++) {
          let couleur = Math.floor(Math.random() * 1.1);
          tableau +=
            '<td class="' +
            (couleur != 0 ? "estvivante" : "") +
            '"data-row="' +
            i +
            '"' +
            'data-col="' +
            j +
            '"></td>';
        }
        tableau += "</tr>";
      }
      this.arrayHtml = tableau;
      let ts2 = performance.now();
      console.log("setupTable : " + (ts2 - ts1));
    },
    setEtat() {
      let ts1 = performance.now();
      this.dataTable = document.getElementById("gameBoard_table");
      let cellules = document.getElementsByTagName("td");
      for (let i = 0; i < cellules.length; i++) {
        this.tableJeu.etat[cellules[i].dataset.row][cellules[i].dataset.col] =
          cellules[i];
      }
      let ts2 = performance.now();
      console.log("setEtat : " + (ts2 - ts1));
    },
    play() {
      let ts1 = performance.now();
      let cellulesVivantes =
        this.dataTable.getElementsByClassName("estvivante");

      for (let i = 0; i < cellulesVivantes.length; i++) {
        let voisinsCellulesVivantes = this.getVoisins(
          parseInt(cellulesVivantes[i].dataset.row),
          parseInt(cellulesVivantes[i].dataset.col),
        );

        for (let j = 0; j < voisinsCellulesVivantes.length; j++) {
          this.tableJeu.nbVoisins[voisinsCellulesVivantes[j].dataset.row][
            voisinsCellulesVivantes[j].dataset.col
          ]++;
        }
      }

      let cellulesAlive = this.checkCellules();

      // reset le tableau à 0
      for (let i = 0; i < this.tableJeu.nbVoisins.length; i++) {
        this.tableJeu.nbVoisins[i].fill(0);
      }
      this.updateFront(cellulesAlive);
      let ts2 = performance.now();
      console.log("play patate : " + (ts2 - ts1));
    },
    getVoisins(row, col) {
      let voisins = [];

      // Traitement de la ligne précédente
      if (row - 1 >= 0) {
        if (col - 1 >= 0) {
          voisins.push(this.tableJeu.etat[row - 1][col - 1]);
        }
        if (col + 1 < this.nbCol) {
          voisins.push(this.tableJeu.etat[row - 1][col + 1]);
        }
        voisins.push(this.tableJeu.etat[row - 1][col]);
      }
      // Traitement de la ligne en cours
      if (col - 1 >= 0) {
        voisins.push(this.tableJeu.etat[row][col - 1]);
      }
      if (col + 1 < this.nbCol) {
        voisins.push(this.tableJeu.etat[row][col + 1]);
      }
      // Traitement de la ligne suivante
      if (row + 1 < this.nbRow) {
        if (col - 1 >= 0) {
          voisins.push(this.tableJeu.etat[row + 1][col - 1]);
        }
        if (col + 1 < this.nbCol) {
          voisins.push(this.tableJeu.etat[row + 1][col + 1]);
        }
        voisins.push(this.tableJeu.etat[row + 1][col]);
      }
      return voisins;
    },
    checkCellules() {
      let cellulesAlive = [];

      for (let i = 0; i < this.tableJeu.etat.length; i++) {
        for (let j = 0; j < this.tableJeu.etat[i].length; j++) {
          //verif si case noire
          let celluleNoire =
            this.tableJeu.etat[i][j].classList.contains("estvivante");

          if (
            (!celluleNoire && this.tableJeu.nbVoisins[i][j] == 3) ||
            (celluleNoire &&
              (this.tableJeu.nbVoisins[i][j] == 2 ||
                this.tableJeu.nbVoisins[i][j] == 3))
          ) {
            cellulesAlive.push(this.tableJeu.etat[i][j]);
          }
        }
      }

      return cellulesAlive;
    },
    updateFront(cellulesAlive) {
      let cellules = this.dataTable.querySelectorAll(".estvivante");
      for (let i = 0; i < cellules.length; i++) {
        cellules[i].classList.remove("estvivante");
      }
      for (let i = 0; i < cellulesAlive.length; i++) {
        cellulesAlive[i].classList.add("estvivante");
      }
      this.nbGeneration++;
    },
    start() {
      if (!this.nIntervId) {
        this.nIntervId = setInterval(this.play, 400);
      }
    },
    pause() {
      this.clearnIntervId();
    },
    restart() {
      this.clearnIntervId();
      this.nbGeneration = 0;
      //this.setVariables();
      this.setupTable();
      this.setEtat();
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
    ::before {
      content: attr(data-parent);
    }
  }
  .estvivante {
    background-color: #b9bec6 !important;
  }
}
</style>
