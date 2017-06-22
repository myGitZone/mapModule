<template>
  <div class="v-toolbar">
    <ul class="bar-item">
      <li v-for="toolbarItem in mapToolConfig.mapTools"
          :key="toolbarItem">
        <component v-bind:is="toolbarItem"
                   :config="config"
                   :dashboard="$refs.dashboard">
        </component>
      </li>
    </ul>
    <div class="dashboard-container"
         ref="dashboard"
         v-if="isShow">
    </div>
  </div>
</template>

<script>
import maptool from './toolbar/index';
export default {
  name: 'mapTool',
  data() {
    return {
      isShow: false
    };
  },
  props: ['mapToolConfig', 'config'],
  components: maptool,
  mounted: function () {
    let _self = this;
    this.$events.$on('changeDisplay', (value) => {
      _self.isShow = value;
    });
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .v-toolbar
    .bar-item
      list-style: none
      background-color: #0a2f4d
      li
        display: inline-block
        padding: 10px 5px
        margin: 5px
        cursor: pointer
    .dashboard-container
      background-color: #0a2f4d
      padding:5px
      margin-top:5px
      .esriMeasurement .esriMeasurementTableContainer .esriMeasurementResultTable .esriMeasurementTableCell
        width: 0
        text-align: end
</style>
