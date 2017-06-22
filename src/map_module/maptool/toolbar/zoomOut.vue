<template>
  <div class="zoomout-container"
       @click="zoomOut">
    <div class="icon"></div>
  </div>
</template>
<script>
  export default {
    name: 'ZoomOut',
    data() {
      return {
        msg: 'zoonOut'
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
      zoomOut: function () {
        this.mapConfig.map.setZoom(this.mapConfig.map.getZoom() - 1);
      }
    }
  };
</script>
<style lang="scss">
.zoomout-container {
  .icon {
    width: 20px;
    height: 20px;
    background-size: contain !important;
    background: #0a2f4d url('../../image/map/toolbar/zoomout.png') no-repeat;
    &:hover {
      background: #0a2f4d url('../../image/map/toolbar/zoomout_selected.png') no-repeat;
    }
  }
}
</style>
