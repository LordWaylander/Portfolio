<template>
  <GameLifeBoard v-if="route !== 'gameLife' && route !== 'langton'" />
  <RouterView />
</template>
<script>
export default {
  data() {
    return {
      route: "",
    };
  },
  watch: {
    $route: {
      handler(newValue) {
        this.route = newValue.name;
      },
      deep: true,
    },
  },
};
</script>

<style scoped></style>
