<template lang="">
  <div class="card">
    <figure>
      <a :href="item.route" target="_blank">
        <img :src="item.image" alt="image de la réalisation" />
      </a>
      <figcaption>
        <h3>{{ item.name }}</h3>
        <span
          ><a v-if="item.info" :href="item.info" target="_blank"
            ><img src="/img/question.png" alt="kézako" class="questionImg" /></a
        ></span>
      </figcaption>
    </figure>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
};
</script>
<style lang="scss" scoped></style>
