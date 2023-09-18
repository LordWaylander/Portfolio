<template lang="">
  <div class="card">
    <a :href="item.route" target="_blank">
      <figure>
        <img :src="item.image" alt="image de la réalisation" />
        <figcaption><h3>{{ item.name }}</h3></figcaption>
      </figure>
    </a>
  </div>
</template>
<script>
export default {
    props: {
        item: {
            type: Object,
            default: {}
        }
    }
};
</script>
<style lang="scss" scoped>
.card {
    width: 100%;
    box-shadow: 0.25em 0.25em 0.25em 0.25em gray;
    border-radius: 1em;
    a{
        text-decoration: none;
        display: block;
        width: 100%;
        height: 100%;
        figure {
            height: 100%;

            img {
                /*width: 25em;
                height: 15em;*/
                border-top-left-radius: 1em;
                border-top-right-radius: 1em;
                width: 100%;
                height: 85%;
            }
            figcaption{
                text-align: center;
                color: var(--color-text);
            }
        }
    }
}
</style>
