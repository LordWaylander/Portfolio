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
      //let copyInitialTable = JSON.parse(JSON.stringify(this.initialTable));

      let cellsAlive = this.initialTable.filter(function (cell) {
        return cell.isAlive === true;
      });

      cellsAlive.forEach((cell) => {
        //console.log('------------');
        //console.log('cellule en cours : '+ 'row : '+cell.row+ 'col : '+cell.col);
        let neighboursCellulesVivantes = this.getNeighbours(
          parseInt(cell.row),
          parseInt(cell.col),
        );
        //console.log('voisines de la cellule en cours');
        //console.log(neighboursCellulesVivantes); // get les 8 voisins

        neighboursCellulesVivantes.forEach((cellOther) => {
          this.initialTable[cellOther.col + cellOther.row * this.nbCols]
            .nbVoisins++;
          // c'est ici que le "tri" est fait entre mort et vivant
        });
      });
      //console.log(this.initialTable);

      let cellulesAlive = this.checkCellules();
      //console.log(cellulesAlive);
      this.updateFront(cellulesAlive);

      let ts2 = performance.now();
      console.log("play : " + (ts2 - ts1));
    },
    updateFront(cellulesAlive) {
      for (const cell of this.initialTable) {
        cell.isAlive = false;
        cell.nbVoisins = 0;
      }

      for (const cell of cellulesAlive) {
        this.initialTable[cell.col + cell.row * this.nbCols].isAlive = true;
      }

      this.nbGeneration++;
    },
    checkCellules() {
      let cellulesAlive = [];
      //console.log('-- checkCellules --');

      this.initialTable.forEach((cell) => {
        let celluleNoire = cell.isAlive === true;

        if (
          (!celluleNoire && cell.nbVoisins == 3) ||
          (celluleNoire && (cell.nbVoisins == 2 || cell.nbVoisins == 3))
        ) {
          //console.log('celluleNoire : '+celluleNoire);
          //console.log('cell.nbVoisins : '+cell.nbVoisins);
          cellulesAlive.push(cell);
        }
      });
      //console.log('-- END checkCellules --');
      return cellulesAlive;
    },
    getNeighbours(row, col) {
      let voisins = [];

      // Traitement de la ligne précédente
      if (row - 1 >= 0) {
        if (col - 1 >= 0) {
          voisins.push(this.initialTable[col - 1 + (row - 1) * this.nbCols]);
        }
        if (col + 1 < this.nbCols) {
          voisins.push(this.initialTable[col + 1 + (row - 1) * this.nbCols]);
        }
        voisins.push(this.initialTable[col + (row - 1) * this.nbCols]);
      }
      // Traitement de la ligne en cours
      if (col - 1 >= 0) {
        voisins.push(this.initialTable[col - 1 + row * this.nbCols]);
      }
      if (col + 1 < this.nbCols) {
        voisins.push(this.initialTable[col + 1 + row * this.nbCols]);
      }
      // Traitement de la ligne suivante
      if (row + 1 < this.nbRows) {
        if (col - 1 >= 0) {
          voisins.push(this.initialTable[col - 1 + (row + 1) * this.nbCols]);
        }
        if (col + 1 < this.nbCols) {
          voisins.push(this.initialTable[col + 1 + (row + 1) * this.nbCols]);
        }
        voisins.push(this.initialTable[col + (row + 1) * this.nbCols]);
      }
      return voisins;
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
