<template lang="">
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
  <table id="langtonBoard">
    <tbody>
      <tr v-for="row in nbRows">
        <td
          v-for="col in nbCols"
          :class="[
            cells[col - 1 + (row - 1) * nbCols] !== false ? 'black' : 'white',
            col - 1 + (row - 1) * nbCols === positionFourmi ? 'fourmi' : '',
          ]"
          :data-row="row - 1"
          :data-col="col - 1"
        ></td>
      </tr>
    </tbody>
  </table>
</template>
<script>
export default {
  data() {
    return {
      nbGeneration: 0,
      nbRows: 0,
      nbCols: 0,
      positionFourmi: 0,
      factorPopulation: 2,
      cellSizeInPx: 15,
      previousMouvement: null,
      nIntervId: null,
      cells: new Array(),
      matricePosition: new Array(),
    };
  },
  created() {
    this.init();
  },
  updated(){
      const fourmi = document.getElementsByClassName('fourmi')[0]
      
      if(this.previousMouvement === this.matricePosition[0]){
        fourmi.style.transform = 'rotate(0.75turn)'
      } else if (this.previousMouvement === this.matricePosition[1]){
        fourmi.style.transform = 'rotate(0.25turn)'
      } else if (this.previousMouvement === this.matricePosition[2]){
        fourmi.style.transform = 'rotate(0turn)'
      }else if(this.previousMouvement === this.matricePosition[3]){
        fourmi.style.transform = 'rotate(0.5turn)'
      }
  },
  mounted() {
    this.start();
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

      this.matricePosition = [
        -1, // left
        +1, // right
        -this.nbCols, // Top
        +this.nbCols, // bottom
      ];
      this.positionFourmi = Math.floor(
       ( this.nbCols) + (this.nbRows / 2) * this.nbCols,
      );
      // définition d'une direction par défault
      this.previousMouvement = this.matricePosition[2];
      for (let i = 0; i < this.nbRows * this.nbCols; i++) {
        this.cells.push(
          //Math.floor(Math.random() * this.factorPopulation) != 0 ? true : false,
          false,
        );
      }
    },
    play() {
      const index = this.positionFourmi;

      if (
        (this.previousMouvement === this.matricePosition[0] &&
          this.cells[index] === true) ||
        (this.previousMouvement === this.matricePosition[1] &&
          this.cells[index] === false)
      ) {
        this.positionFourmi = index + this.matricePosition[3];
        this.previousMouvement = this.matricePosition[3];
      } else if (
        (this.previousMouvement === this.matricePosition[0] &&
          this.cells[index] === false) ||
        (this.previousMouvement === this.matricePosition[1] &&
          this.cells[index] === true)
      ) {
        this.positionFourmi = index + this.matricePosition[2];
        this.previousMouvement = this.matricePosition[2];
      } else if (
        (this.previousMouvement === this.matricePosition[2] &&
          this.cells[index] === true) ||
        (this.previousMouvement === this.matricePosition[3] &&
          this.cells[index] === false)
      ) {
        this.positionFourmi = index + this.matricePosition[0];
        this.previousMouvement = this.matricePosition[0];
      } else if (
        (this.previousMouvement === this.matricePosition[2] &&
          this.cells[index] === false) ||
        (this.previousMouvement === this.matricePosition[3] &&
          this.cells[index] === true)
      ) {
        this.positionFourmi = index + this.matricePosition[1];
        this.previousMouvement = this.matricePosition[1];
      }

      this.cells[index] = !this.cells[index];
      this.nbGeneration++;
    },
    start() {
      if (!this.nIntervId) {
        this.nIntervId = setInterval(this.play, 0);
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
  },
};
</script>
<style lang="scss" scoped>
</style>
