<template>
  <div class="full-screen-container" @click="toggleFullScreen">
    <div class="icon" :class="{ activated: isFullScreen }"></div>
  </div>
</template>

<script>
export default {
  name: 'FullScreen',
  data() {
    return {
      isFullScreen: false
    };
  },
  methods: {
    toggleFullScreen: function () {
      let el = this.$parent.$refs.mapContent || this.$parent.$parent.$refs.mapContent;
      if (!el.classList.contains('all-screen')) {
        el.classList.add('all-screen');
        this.isFullScreen = true;
      } else {
        el.classList.remove('all-screen');
        this.isFullScreen = false;
      }
    }
  }
};
</script>

<style lang="scss">
.full-screen-container {
  .icon {
    width: 20px;
    height: 20px;
    background-size: contain !important;
    background: #0a2f4d url('../../image/map/toolbar/allScreen.png') no-repeat;
    &:hover {
      background: #0a2f4d url('../../image/map/toolbar/allScreen_selected.png') no-repeat;
    }
  }
  .icon.activated {
    background: #0a2f4d url('../../image/map/toolbar/cancel.png') no-repeat;
    &:hover {
      background: #0a2f4d url('../../image/map/toolbar/cancel_selected.png') no-repeat;
    }
  }
}
</style>
