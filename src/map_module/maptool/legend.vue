<template>
  <div class="legend-box">
    <div :class="[flag?'plugin-arrow-legend':'top-arrow-legend']" @click="hiddenLegend">
    </div>
    <!--<transition name="slide-fade">-->
    <div class="legend-container" ref="legendContainer" v-if="show">
    </div>
    <!--</transition>-->
  </div>
</template>
<script>
export default {
  name: 'MapLegend',
  data() {
    return {
      isLoaderAdded: false,
      arcgisClass: null,
      show: true,
      flag: true // 标志位,true为下箭头;false为上箭头(通过点击事件改变flag为'true'或'false')
    };
  },
  props: {
    // 基础配置
    mapConfig: {
      map: {
        type: Object,
        required: true
      },
      esriLoader: {
        type: Object,
        required: true
      }
    },
    elId: {
      type: String,
      default: 'overview',
      required: true
    },
    layerInfos: {
      required: false
    }
  },
  watch: {
    mapConfig: function (value) {
      if (value.map != null && !this.isLoaderAdded) {
        this.initEsriLoaders();
      }
    },
    isLoaderAdded: function (val) {
      if (val) {
        this.initMapLegend(this.layerInfos);
      }
    },
    layerInfos: function (value) {
      if (value && value.length > 0 && this.isLoaderAdded) {
        this.initMapLegend(value);
      }
    },
    flag: function () {
    }
  },
  mounted: function () {
    this.$events.$on('mapTypeChange', (data) => {
      this.initMapLegend(this.layerInfos);
    });
  },
  methods: {
    // 点击图例的隐藏箭头,图例隐藏
    hiddenLegend: function () {
      var pluArrow = document.getElementsByClassName('plugin-arrow-legend')[0];
      if (this.flag === false) {
        pluArrow = document.getElementsByClassName('top-arrow-legend')[0];
      }
      var legendContainer = document.getElementsByClassName('legend-container')[0];
      var containerState = legendContainer.style.display;
      var ele = pluArrow;
      if (containerState === 'none') { // 放大图例
        while (ele.className !== 'legend-wrapper') {
          ele = ele.parentElement;
        }
        ele.style.width = '170px';
        ele.style.height = '200px';
        legendContainer.style.display = 'block';
        // this.animate(ele, { width: 270, height: 200 }, 10, 0.05); // 动画效果
        ele.style.backgroundColor = '#0a162c';
        ele.style.overflowY = 'auto';
        ele.style.boxShadow = '0 0 10px #666';
        this.flag = true;
      } else { // 缩小图例
        while (ele.className !== 'legend-wrapper') {
          ele = ele.parentElement;
        }
        ele.style.width = '15px';
        ele.style.height = '15px';
        // this.animate(ele, { width: 15, height: 15 }, 10, 0.05); // 动画效果
        ele.style.overflowY = '';
        ele.style.boxShadow = '';
        ele.style.backgroundColor = '#0a162c';
        legendContainer.style.display = 'none';
        this.flag = false;
      }
    },
    showLegendNone: function () {
      document.getElementsByClassName('legend-wrapper')[0].style.background = 'linear-gradient(to bottom, #0a162c, #0a2f4d)';
      document.getElementById('maplegend').style.background = '#0a162c';
      document.getElementsByClassName('legend-container')[0].style.background = '#0a162c';
    },
    showLegendBackground: function () {
      document.getElementById('maplegend').style.background = 'linear-gradient(to bottom, #0a162c, #0a2f4d)';
    },
    initEsriLoaders: function () {
      this.mapConfig.esriLoader.dojoRequire(['esri/dijit/Legend'], (Legend) => {
        this.arcgisClass = { Legend };
        this.isLoaderAdded = true;
      });
    },
    initMapLegend: function (layInfos) {
      if (this.$refs.legendContainer.children.length === 0) {
        let legendEl = window.document.createElement('div');
        legendEl.id = this.elId;
        legendEl.className = 'legend';
        this.$refs.legendContainer.appendChild(legendEl);
      }
      let _this = this;
      this.$nextTick(function () {
        if (!this.mapConfig.map.featureLegend) {
          this.mapConfig.map.featureLegend = new this.arcgisClass.Legend({
            map: _this.mapConfig.map,
            layerInfos: layInfos
          }, _this.elId);
          this.mapConfig.map.featureLegend.startup();
        } else {
          this.mapConfig.map.featureLegend.layerInfos = layInfos;
          this.mapConfig.map.featureLegend.refresh();
        }
        this.isLoaderAdded = true;
      });
    },
    // js动画,这里没有使用这个方法
    animate: function (obj, json, interval, sp, fn) {
      clearInterval(obj.timer);
      function getStyle(obj, arr) {
        if (obj.currentStyle) {
          return obj.currentStyle[arr]; // 针对ie
        } else {
          return document.defaultView.getComputedStyle(obj, null)[arr];
        }
      }
      obj.timer = setInterval(function () {
        var flag = true;
        for (var arr in json) {
          var icur = 0;
          if (arr === 'opacity') {
            icur = Math.round(parseFloat(getStyle(obj, arr)) * 100);
          } else {
            icur = parseInt(getStyle(obj, arr));
          }
          var speed = (json[arr] - icur) * sp;
          speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
          if (icur !== json[arr]) {
            flag = false;
          }
          if (arr === 'opacity') {
            obj.style.filter = "alpha(opacity : '+(icur + speed)+' )";
            obj.style.opacity = (icur + speed) / 100;
          } else {
            obj.style[arr] = icur + speed + 'px';
          }
        }

        if (flag) {
          clearInterval(obj.timer);
          if (fn) {
            fn();
          }
        }
      }, interval);
    }
  }
};
</script>
<style lang="scss">
.legend-box {
  height: 100%;
}

.plugin-arrow-legend {
  position: absolute;
  right: 0;
  top: 0;
  width: 15px;
  height: 15px;
  background-color: #0a162c;
  background-image: url(../image/button_bottom_active.png);
  z-index: 1;
  cursor: pointer;
}

.top-arrow-legend {
  position: absolute;
  right: 0;
  top: 0;
  width: 15px;
  height: 15px;
  background-color: #0a162c;
  background-image: url(../image/button_top_active.png);
  z-index: 1;
  cursor: pointer;
}

.legend-container {
  position: relative;
  width: 100%;
  height: 100%;
  .legend {
    height: 100%;
    background: linear-gradient(to bottom, #0a162c, #0a2f4d);
    .esriLegendServiceLabel {
      padding: 5px;
      line-height: 1.5;
    }
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  animation: all 1.3s ease;
}

.slide-fade-enter,
.slide-fade-leave-active {
  animation: all 1.3s ease;
  height: 0;
  width: 0;
}
</style>
