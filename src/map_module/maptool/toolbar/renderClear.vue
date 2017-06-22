<template>
  <div class="render-clear-container" @click="clearRender">
    <div class="icon"></div>
  </div>
</template>

<script>
export default {
  name: 'RenderClear',
  data() {
    return {
      msg: 'render-clear'
    };
  },
  props: ['map', 'clearCallBack'],
  methods: {
    clearRender: function () {
      if (this.clearCallBack) {
        this.clearCallBack();
      }
    }
  }
};
</script>

<style lang="scss">
.render-clear-container {
  .icon {
    width: 20px;
    height: 20px;
    background-size: contain !important;
    background: #0a2f4d url('../../image/map/toolbar/clear.png') no-repeat;
    &:hover {
      background: #0a2f4d url('../../image/map/toolbar/clear_selected.png') no-repeat;
    }
  }
}
</style>
