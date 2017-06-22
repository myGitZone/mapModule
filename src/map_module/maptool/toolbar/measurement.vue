<template>
  <div class="measurement-container" @click="changeBoardState">
    <div class="icon"></div>
  </div>
</template>

<script>
import dashboard from './measure-board';
export default {
  name: 'Measurement',
  data() {
    return {
      dashboard,
      esriClass: null
    };
  },
  props: {
    mapConfig: {
      map: {
        type: Object,
        default: null
      },
      esriLoader: {
        type: Object
      }
    },
    elId: {
      type: String,
      required: true,
      default: 'measureboard'
    }
  },
  watch: {
    mapConfig: function (val, oldVal) {
      if (val.map != null && oldVal.map == null) {
        this.initEsriClass();
      }
    }
  },
  mounted: function () {
    this.$events.$emit('barItemBoardInited', this.$options.name, this.dashboard, this);
  },
  methods: {
    initEsriClass: function () {
      this.mapConfig.esriLoader.dojoRequire(['esri/dijit/Measurement', 'esri/units', 'dojo/dom'], (Measurement, Units, dom) => {
        this.esriClass = { Measurement, Units, dom };
      });
    },
    initMeasureBoard: function (el) {
      if (el && this.esriClass) {
        el.id = this.elId;
        this.mapConfig.map.measurement = this.esriClass.Measurement({
          map: this.mapConfig.map,
          defaultAreaUnit: this.esriClass.Units.SQUARE_METERS,
          defaultLengthUnit: this.esriClass.Units.METERS
        }, this.esriClass.dom.byId(this.elId));
        this.mapConfig.map.measurement.startup();
      };
    },
    changeBoardState: function () {
      this.$events.$emit('barItemClick', { vmName: this.$options.name });
    }
  }
};
</script>
<style lang="scss">
.measurement-container {
  position: relative;
  .icon {
    width: 20px;
    height: 20px;
    background-size: contain !important;
    background: #0a2f4d url('../../image/map/toolbar/measure.png') no-repeat;
    &:hover {
      background: #0a2f4d url('../../image/map/toolbar/measure_selected.png') no-repeat;
    }
  }
}
</style>
