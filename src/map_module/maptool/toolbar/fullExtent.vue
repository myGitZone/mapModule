<template>
  <div class="full-extent-container" @click="setFullExtent">
    <div class="icon"></div>
  </div>
</template>
<script>
export default {
  name: 'FullExtent',
  data() {
    return {
      msg: 'full-extent'
    };
  },
  props: {
    mapConfig: {
      map: {
        type: Object,
        required: true
      },
      esriLoader: {
        type: Object,
        required: true
      }
    }
  },
  methods: {
    setFullExtent: function () {
      this.mapConfig.map.setExtent(this.mapConfig.map.initExtent || this.mapConfig.map.extent);
    }
  }
};
</script>
<style lang="scss">
.full-extent-container {
  .icon {
    width: 20px;
    height: 20px;
    background-size: contain !important;
    background: #0a2f4d url('../../image/map/toolbar/home.png') no-repeat;
    &:hover {
      background: #0a2f4d url('../../image/map/toolbar/home_selected.png') no-repeat;
    }
  }
}
</style>
