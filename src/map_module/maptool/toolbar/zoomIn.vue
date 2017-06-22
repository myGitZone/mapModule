<template>
  <div class="zoomin-container" @click="zoomIn">
    <div class="icon"></div>
  </div>
</template>
<script>
export default {
  name: 'ZoomIn',
  data() {
    return {
      msg: 'zoonIn'
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
    zoomIn: function () {
      this.mapConfig.map.setZoom(this.mapConfig.map.getZoom() + 1);
    }
  }
};
</script>
<style lang="scss">
.zoomin-container {
  .icon {
    width: 20px;
    height: 20px;
    background-size: contain !important;
    background: #0a2f4d url('../../image/map/toolbar/zoomin.png') no-repeat;
    &:hover {
      background: #0a2f4d url('../../image/map/toolbar/zoomin_selected.png') no-repeat;
    }
  }
}
</style>
