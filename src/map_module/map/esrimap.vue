<template>
  <div class="map-container" ref="mapContent">
    <div :id="elId" class="map-box">
      <!-- 工具栏 -->
      <div class="toolbar-wrapper" ref="toolbar">
        <slot name="toolbar"></slot>
        <!-- 工具栏面板 -->
        <div class="barboard-wrapper">
          <keep-alive>
            <component :is="$options.components[curVmName]" :barVm="toolObject[curVmName]" v-if="!((curVmName + 'position' in toolObject)&&toolObject[curVmName + 'position']==='center')">
            </component>
          </keep-alive>
        </div>
      </div>
      <component :is="$options.components[curVmName]" :barVm="toolObject[curVmName]" v-if="(curVmName + 'position' in toolObject)&&toolObject[curVmName + 'position']==='center'">
      </component>
      <!-- 地图类型 -->
      <div class="maptype-wrapper" ref="maptype">
        <slot name="mapType"></slot>
      </div>
      <!-- 地图图例-->
      <div class="legend-wrapper" ref="legend">
        <slot name="mapLegend"></slot>
      </div>
      <!-- 鹰眼 -->
      <div class="overview-wrapper" ref="overview">
        <slot name="overviewMap"></slot>
      </div>
      <!-- 其他分发内容 -->
      <slot></slot>
    </div>
  </div>
</template>

<script>
import * as esriLoader from 'esri-loader';

export default {
  name: 'EsriMap',
  data() {
    return {
      esriLoader: esriLoader,
      map: null,
      isloaded: false,
      curVmName: '',
      toolObject: {},
      mapClickEvent: null
    };
  },
  props: {
    elId: {
      type: String,
      default: 'page-map',
      required: true
    },
    isAddBaseMap: {
      type: Boolean,
      default: true
    },
    extention: {
      type: Object
    },
    proxyUrl: {
      type: String,
      default: ''
    }
  },
  computed: {
    mapToolConfig: function () {
      return this.mapConfig;
    },
    configData: function () {
      return {
        map: this.map,
        esriLoader: this.esriLoader
      };
    }
  },
  created: function () {
    let _self = this;
    this.$events.$on('barItemBoardInited', (name, comp, vm, position) => {
      _self.$options.components[name] = comp;
      _self.$set(_self.toolObject, name, vm);
      _self.$set(_self.toolObject, name + 'position', position);
    });
  },
  mounted: function () {
    // if (this.$slots.mapLegend) {
    //   this.$refs.legend.style.display = 'block';
    // }
    this.loadEsriAPI();
    let _self = this;
    this.$events.$on('barItemClick', (barConfig) => {
      // 这里判断是否为i键查询功能
      if (barConfig.vmName === 'ISearch') {
        if (!this.mapClickEvent) {
          // 控制激活的样式
          this.toolObject['ISearch'].active = true;
          // 如果是i键查询功能，则通过控制curVmName的值来控制i键查询的结果展示面板
          _self.curVmName = '';
          this.mapClickEvent = this.activeMapClick();
        } else {
          // 控制激活的样式
          this.toolObject['ISearch'].active = false;
          this.mapClickEvent.remove();
          this.mapClickEvent = null;
        }
        return;
      }
      if (!_self.curVmName || _self.curVmName === '') {
        _self.curVmName = barConfig.vmName;
      } else if (_self.curVmName !== barConfig.vmName) {
        _self.curVmName = barConfig.vmName;
      } else if (_self.curVmName === barConfig.vmName) {
        _self.curVmName = '';
      }
    });
  },
  methods: {
    // 地图点击之后，获取到查询结果，并进行展示
    isearchResultShow(result) {
      this.toolObject['ISearch'].getLayers();
      this.toolObject['ISearch'].resultData = result;
      this.curVmName = 'ISearch';
    },
    // 地图点击事件激活
    activeMapClick() {
      var _self = this;
      let handle = this.map.on('click', function (e) {
        var currentInfo = _self.toolObject['ISearch'].currentInfo;
        _self.$emit('mapClikc', e, currentInfo.currentUrl);
      }); // _self.toolObject['ISearch'].activeMapClick;
      return handle;
    },
    loadEsriAPI: function () {
      if (!esriLoader.isLoaded()) {
        esriLoader.bootstrap((err) => {
          if (err) {
            console.error(err);
          }
          this.initMap();
        }, {
            // 'https://js.arcgis.com/3.19/'
            url: 'http://' + window.systemIp + '/arcgis_js_api/library/3.19/3.19/init.js'
          });
      } else {
        // ArcGIS API is already loaded, just create the map
        this.initMap();
      }
    },
    initMap: function () {
      this.esriLoader.dojoRequire(['esri/map', 'esri/geometry/Extent', 'tdlib/TianDiTuLayer', 'esri/tasks/query', 'esri/tasks/QueryTask', 'esri/config'], (Map, Extent, TianDiTuLayer, Query, QueryTask, esriConfig) => {
        if (this.proxyUrl) {
          esriConfig.defaults.io.proxyUrl = this.proxyUrl;
        }
        this.map = new Map(this.elId, { // 主map
          extent: new Extent(this.extention),
          logo: false,
          slider: false
        });
        // 给map赋值初始范围属性，全图工具使用该属性。
        this.map.initExtent = this.map.extent;
        if (this.isAddBaseMap) {
          let baseMapLayer = new TianDiTuLayer('矢量底图', {
            id: 'baseMap'
          });
          this.map.addLayer(baseMapLayer);
          let baseLabelLayer = new TianDiTuLayer('矢量标注', {
            id: 'baseLabel'
          });
          this.map.addLayer(baseLabelLayer);
        }
        this.$on('mapClikc', (e, currentUrl) => {
          if (!currentUrl) {
            return;
          }
          var mp = e.mapPoint;
          var pad = this.map.extent.getWidth() / this.map.width * 3;
          var queryGeom = new Extent(mp.x - pad, mp.y - pad, mp.x + pad, mp.y + pad, this.map.spatialReference);
          var q = new Query();
          q.outSpatialReference = this.map.spatialReference;
          q.returnGeometry = true;
          q.where = '1=1';
          q.outFields = ['*'];
          q.geometry = queryGeom;
          var qt;
          qt = new QueryTask(currentUrl);
          qt.execute(q, this.isearchResultShow, function (e) {
            if (console) {
              console.log(e);
            }
          });
        });
        this.$emit('mapReady', this);
      });
    },
    setMapCompsStyle: function (el, styleOptions) {
      if (el && styleOptions) {
        for (let propName in styleOptions) {
          el.style[propName] = styleOptions[propName];
        }
      }
    },
    setMapTypeLocate: function (styleOptions) {
      this.setMapCompsStyle(this.$refs.maptype, styleOptions);
    },
    setMapLegendLocate: function (styleOptions) {
      this.setMapCompsStyle(this.$refs.legend, styleOptions);
    },
    setMapToolLocate: function (styleOptions) {
      this.setMapCompsStyle(this.$refs.toolbar, styleOptions);
    },
    setOverviewMapLocate: function (styleOptions) {
      this.setMapCompsStyle(this.$refs.overview, styleOptions);
    }
  }
};
</script>

<style>
@import 'https://js.arcgis.com/3.19/esri/css/esri.css';
@import 'https://js.arcgis.com/3.19/dijit/themes/claro/claro.css';
@import '../maptool.css';
</style>
<style lang="stylus" rel="stylesheet/stylus">
  .map-container
    position: relative
    overflow hidden
    width: 100%
    height: 100%
    .map-box
      width: 100%;
      height: 100%; // 隐藏Logo
      color: #fff
      .tooltip      // 这里是因为上面color设置为白色，影响了esri本身元素的颜色
        color: #000
      .esriControlsBR
        display: none
      .toolbar-wrapper
        position: absolute
        display: none
        right: 20px
        top: 30px
        user-select: none
        box-shadow: 0 0 10px #666
        z-index: 1
        .toolbar-list
          list-style: none
          background-color: #0a2f4d
          .toolbar
            vertical-align: middle;
            display: table-cell
            padding: 10px 5px
            cursor: pointer
      .barboard-wrapper
        position: absolute
        background-color: #0a2f4d
        width: 100%
        margin-top: 10px
      .maptype-wrapper
        position: absolute
        display: none
        left: 20px
        top: 100px
        box-shadow: 0 0 10px #666
        z-index: 1
      .legend-wrapper
        position: absolute
        width: 170px
        height: 200px
        display: none
        left: 20px
        bottom: 5px
        box-shadow: 0 0 10px #666
        z-index: 1
        overflow-y: auto;
        background-color: rgb(10, 22, 44);
      .overview-wrapper
        position: absolute
        display: none
        right: 5px
        bottom: 5px
        width: 300px
        height: 200px
        box-shadow: 0 0 10px #666
        z-index: 1

  .all-screen
    position: fixed !important
    top: 0
    left: 0
    bottom: 0
    right: 0
    width: 100%
    height: 100%
    z-index: 100
    .map-box
      .toolbar-wrapper
        right: 10px !important
      .maptype-wrapper
        left: 10px !important
      .legend-wrapper
        left: 10px !important
      .overview-wrapper
        right: 10px !important
</style>
