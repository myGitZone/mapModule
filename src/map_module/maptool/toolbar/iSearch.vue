<template>
  <div class="isearch-container" @click="iSearchClick">
    <div :class="{'active-control':active}" class="icon"></div>
  </div>
</template>
<script>
  import dashboard from './iSearch-board';
  export default{
    name: 'ISearch',
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
    mounted: function () {
      this.$events.$emit('barItemBoardInited', this.$options.name, this.dashboard, this, 'center');
    },
    data() {
      return {
        dashboard,
        Extent: {},
        Query: {},
        QueryTask: {},
        mapClickEvent: null,
        isStart: false,
        currentInfo: {
          currentUrl: null,
          currentName: null
        },
        layerInfo: [],
        resultData: null,
        active: false
      };
    },
    created() {
      var _self = this;
      if (this.mapConfig.esriLoader) {
        this.mapConfig.esriLoader.dojoRequire(['esri/geometry/Extent', 'esri/tasks/query', 'esri/tasks/QueryTask'],
          function (Extent, Query, QueryTask) {
            _self.Extent = Extent;
            _self.Query = Query;
            _self.QueryTask = QueryTask;
          });
      }
    },
    methods: {
      getLayers() {
        this.layerInfo = [];
        // 获取map上所有可见的图层
        var layers = this.mapConfig.map.getLayersVisibleAtScale();
        // 遍历图层，在下拉列表中展示
        for (let k = 0; k < layers.length; k++) {
          // 判断是否有子图层,在目前的项目中用的mapserver有layerInfos该属性
          if (layers[k].layerInfos) {
            for (var m = 0; m < layers[k].layerInfos.length; m++) {
              if (layers[k].layerInfos[m].name === undefined) {
                continue;
              }
              var layerid = layers[k].layerInfos[m].id;
              if (layers[k].visibleLayers.indexOf(layerid) < 0) {
                continue;
              }
              let obj = {
                currentName: layers[k].id + '_' + layers[k].layerInfos[m].name,
                currentUrl: layers[k].url + '/' + layerid
              };
              if (!this.currentInfo.currentName) {
                this.currentInfo = obj;
              }
              this.layerInfo.push(obj);
            }
          } else {
            // 如果没有子图层，则为featurelayer
            if (layers[k].name === undefined) {
              continue;
            }
            let obj = {
              currentName: layers[k].name,
              currentUrl: layers[k].url
            };
            if (!this.currentInfo.currentName) {
              this.currentInfo = obj;
            }
            this.layerInfo.push(obj);
          }
        }
      },
      iSearchClick() {
        this.$events.$emit('barItemClick', {vmName: this.$options.name});
        this.getLayers();
      },
      startSearch() {
        var _self = this;
        var map = this.mapConfig.map;
        var EsriExtent = this.Extent;
        var EsriQuery = this.Query;
        var EsriQueryTask = this.QueryTask;
        // 绑定地图点击事件
        this.mapClickEvent = map.on('click', function (e) {
          // 获取点击的点
          var mp = e.mapPoint;
          var pad = map.extent.getWidth() / map.width * 3;
          // 根据点创建一个extent对象，用来做空间查询
          var queryGeom = new EsriExtent(mp.x - pad, mp.y - pad, mp.x + pad, mp.y + pad, map.spatialReference);
          // 初始化Query对象
          var query = new EsriQuery();
          // 查询的空间参考
          query.outSpatialReference = map.spatialReference;
          // 是否返回几何图形
          query.returnGeometry = true;
          // 查询的属性条件。这里不做处理，
          query.where = '1=1';
          // 要查询的字段
          query.outFields = ['*'];
          // 要查询的几何条件
          query.geometry = queryGeom;
          // 新建查询任务
          var qt = new EsriQueryTask(_self.currentUrl);
          // 执行查询。并将结果通过回调的形式返回
          qt.execute(query, _self.showResult, function (e) {
            if (console) {
              console.log(e);
            }
          });
        });
      },
      /**
       * 开启I键的时候，是没有指定查询图层的，所以获取map上最上层的图层
       * */
      getFirstLayerUrl() {
        // 获取当前范围所有可见的图层
        var layers = this.mapConfig.map.getLayersVisibleAtScale();
        var layer;
        // 遍历确定第一个图层，因为图层是数组，最后面的是最上层的，所有降序查找
        for (var i = layers.length - 1; i >= 0; i--) {
          layer = layers[i];
          // 判断layer类型。暂定layer.name为featurelayer  layer.layerInfos为mapserver
          if (layer.name !== undefined || layer.layerInfos !== undefined) {
            break;
          }
        }
        // 如果为空说明没有查到
        if (layer === undefined) {
          return null;
        }
        // 如果是mapsever则要拼接一下
        if (layer.layerInfos) {
          return layer.url + '/' + layer.layerInfos[0].id;
        } else {
          return layer.url;
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .isearch-container {
    position: relative;
    .icon {
      width: 20px;
      height: 20px;
      background-size: contain !important;
      background: #0a2f4d url('../../image/map/toolbar/isearch.png') no-repeat;
      &:hover {
        background: #0a2f4d url('../../image/map/toolbar/isearch_selected.png') no-repeat;
      }
    }
    .active-control {
      background: #0a2f4d url('../../image/map/toolbar/isearch_selected.png') no-repeat;
    }
  }


</style>
