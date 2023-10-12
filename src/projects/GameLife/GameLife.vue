<template lang="">
  <div class="gameLife">
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
    <GameLifeBoard
      :startApp="startApp"
      :pauseApp="pauseApp"
      :restartApp="restartApp"
      @update-nb-generation="updateNbGeneration"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      nbGeneration: 0,
      startApp: false,
      pauseApp: false,
      restartApp: false,
    };
  },
  methods: {
    start() {
      this.startApp = true;
      this.pauseApp = false;
      this.restartApp = false;
    },
    pause() {
      this.pauseApp = true;
      this.startApp = false;
      this.restartApp = false;
    },
    restart() {
      this.restartApp = true;
      this.startApp = false;
      this.pauseApp = false;
      this.nbGeneration = 0;
    },
    updateNbGeneration(value) {
      this.nbGeneration = value;
    },
  },
};
</script>
<style lang="scss" scoped></style>
