<template>
  <div class="o-box">
    <div :class="[flag?'plugin-arrow-overview':'top-arrow-overview']" class="plugin-arrow-overview" @click="hiddenLegend">
    </div>
    <div class="overview-container" ref="overviewContainer">
    </div>
  </div>
</template>
<script>
export default {
  name: 'OverViewMap',
  data() {
    return {
      isLoaderAdded: false,
      arcgisClass: null,
      flag: true // 标志位,true为下箭头;false为上箭头(通过点击事件改变flag为'true'或'false')
    };
  },
  props: {
    // 基础配置
    mapConfig: {
      default: null
    },
    // 鹰眼初始化容器id
    elId: {
      type: String,
      default: 'overview',
      required: true
    }
  },
  watch: {
    mapConfig: function (value) {
      if (value.map != null && !this.isLoaderAdded) {
        this.initEsriLoaders();
      }
    },
    arcgisClass: function (value) {
      if (value) {
        this.initOverViewMap();
      }
    },
    flag: function () {
    }
  },
  mounted: function () {
    // 监听地图类型变化 -by mapType.vue
    this.$events.$on('mapTypeChange', () => {
      this.initOverViewMap();
    });
  },
  methods: {
    // 点击鹰眼的隐藏箭头,鹰眼隐藏
    hiddenLegend: function () {
      var pluArrow = document.getElementsByClassName('plugin-arrow-overview')[0];
      if (this.flag === false) {
        pluArrow = document.getElementsByClassName('top-arrow-overview')[0];
      }
      var overviewContainer = document.getElementsByClassName('overview-container')[0];
      var containerState = overviewContainer.style.display;
      var ele = pluArrow;
      if (containerState === 'none') { // 放大鹰眼
        while (ele.className !== 'overview-wrapper') {
          ele = ele.parentElement;
        }
        ele.style.width = '300px';
        ele.style.height = '200px';
        overviewContainer.style.display = 'block';
        // this.animate(ele, { width: 270, height: 200 }, 10, 0.05); // 动画效果
        ele.style.backgroundColor = '';
        ele.style.boxShadow = '0 0 10px #666';
        this.flag = true;
      } else { // 缩小鹰眼
        while (ele.className !== 'overview-wrapper') {
          ele = ele.parentElement;
        }
        ele.style.width = '15px';
        ele.style.height = '15px';
        // this.animate(ele, { width: 15, height: 15 }, 10, 0.05); // 动画效果
        ele.style.boxShadow = '';
        overviewContainer.style.display = 'none';
        this.flag = false;
      }
    },
    initEsriLoaders: function () {
      this.mapConfig.esriLoader.dojoRequire(['tdlib/OverviewMap'], (OverviewMap) => {
        this.arcgisClass = { OverviewMap };
        this.isLoaderAdded = true;
      });
    },
    initOverViewMap: function () {
      if (this.mapConfig.map.overviewMapDijit) {
        this.mapConfig.map.overviewMapDijit.destroy();
        this.mapConfig.map.overviewMapDijit = null;
      }
      if (this.$refs.overviewContainer.children.length === 0) {
        let overViewEl = window.document.createElement('div');
        overViewEl.id = this.elId;
        overViewEl.classList.add = 'overview-box';
        this.$refs.overviewContainer.appendChild(overViewEl);
      }
      this.$nextTick(function () {
        this.mapConfig.map.overviewMapDijit = new this.arcgisClass.OverviewMap({
          map: this.mapConfig.map,
          visible: true
        }, this.elId);
        this.mapConfig.map.overviewMapDijit.startup();
        this.isLoaderAdded = true;
      });
    }
  }
};
</script>
<style lang="scss">
.o-box {
  height: 200px;
  .plugin-arrow-overview {
    position: absolute;
    top: 0;
    width: 15px;
    height: 15px;
    background-image: url(../image/button_bottom_active.png);
    z-index: 100;
    cursor: pointer;
  }
  .top-arrow-overview {
    position: absolute;
    top: 0;
    width: 15px;
    height: 15px;
    background-image: url(../image/button_top_active.png);
    z-index: 100;
    cursor: pointer;
  }

  .overview-container {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #666;
    .esriOverviewMap,
    .overview-box {
      width: 100%;
      height: 100%;
      background-color: #666;
      .ovwContainer {
        width: 100% !important;
        height: 100% !important;
      }
    }
  }
}
</style>
