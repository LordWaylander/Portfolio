<template lang="">
  <div class="card">
    
      <figure>
        <a :href="item.route" target="_blank">
          <img :src="item.image" alt="image de la réalisation" />
        </a>
        <figcaption>
          <h3>{{ item.name }} </h3><span><a v-if="item.info" :href="item.info" target="_blank"><img src="/img/question.png" alt="kézako" class="questionImg"/></a></span>
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
<style lang="scss" scoped>
/*.card {
  width: 100%;
  box-shadow: 0.25em 0.25em 0.25em 0.25em gray;
  border-radius: 1em;
  a {
    text-decoration: none;
    display: block;
    width: 100%;
    height: 100%;
    figure {
      img {
        border-top-left-radius: 1em;
        border-top-right-radius: 1em;
        width: 100%;
        height: 85%;
      }
      figcaption {
        text-align: center;
        color: var(--primary-text);
      }
    }
  }
}*/
</style>
