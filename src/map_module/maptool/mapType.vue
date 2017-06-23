<template>
  <div class="maptype-container">
    <ul>
      <li class="mapTypeCard active" :class="firstType.class" id="normal" @click="changeMapType(0)">
        <span>{{firstType.name}}</span>
      </li>
      <li class="mapTypeCard" :class="secondType.class" id="earch" @click="changeMapType(1)">
        <span>{{secondType.name}}</span>
      </li>
      <li class="mapTypeCard" :class="thirdType.class" id="terrain" @click="changeMapType(2)">
        <span>{{thirdType.name}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'MapType',
  data() {
    return {
      firstType: {
        class: 'normal',
        name: '矢量'
      },
      secondType: {
        class: 'earch',
        name: '地形'
      },
      thirdType: {
        class: 'terrain',
        name: '影像'
      },
      layers: {
        '矢量': {
          baseMapName: '矢量底图',
          baseLabelName: '矢量标注'
        },
        '地形': {
          baseMapName: '地形底图',
          baseLabelName: '地形标注'
        },
        '影像': {
          baseMapName: '影像底图',
          baseLabelName: '影像标注'
        }
      }
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
    }
  },
  methods: {
    changeMapType: function (index) {
      if (!this.mapConfig.map.getLayer('baseMap')) return;
      let _self = this;
      // 记录当前选中的类型
      let currentTypeName = null;
      let tempObj = null;
      switch (index) {
        case 0:
          return;
        case 1:
          currentTypeName = this.secondType.name;
          tempObj = this.firstType;
          this.firstType = this.secondType;
          this.secondType = tempObj;
          break;
        case 2:
          currentTypeName = this.thirdType.name;
          tempObj = this.firstType;
          this.firstType = this.thirdType;
          this.thirdType = tempObj;
          break;
        default:
          return;
      }
      let { baseMapName, baseLabelName } = this.layers[currentTypeName];
      debugger;
      this.mapConfig.esriLoader.dojoRequire(['esri/map', 'esri/geometry/Extent', 'tdlib/TianDiTuLayer'], (Map, Extent, TianDiTuLayer) => {
        let baseMapLayer = new TianDiTuLayer(baseMapName, {
          id: 'baseMap'
        });
        let baseLabelLayer = new TianDiTuLayer(baseLabelName, {
          id: 'baseLabel'
        });
        _self.mapConfig.map.removeLayer(_self.mapConfig.map.getLayer('baseMap'));
        _self.mapConfig.map.removeLayer(_self.mapConfig.map.getLayer('baseLabel'));
        _self.mapConfig.map.addLayer(baseMapLayer, 0);
        _self.mapConfig.map.addLayer(baseLabelLayer, 1);
        _self.active = event.target.id;
        // 触发鹰眼的mapTypeChange -by overviewMap.vue
        _self.$events.$emit('mapTypeChange', { baseMap: baseMapLayer, baseLabel: baseLabelLayer });
      });
    }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .maptype-container
    ul
      position: relative
      overflow: auto
      padding: 5px
      background-color: rgba(140, 140, 140, 0.3)
      &:hover
        .mapTypeCard
          width: 80px
          margin-right: 10px
          background-size:100% 100%
          span
            display: inline
      .mapTypeCard
        position: relative
        height: 60px
        width: 10px
        float: left
        background-size:100% 100% !important
        cursor: pointer
        -webkit-transition: width 0.2s ease-out
        -moz-transition: width 0.2s ease-out
        -ms-transition: width 0.2s ease-out
        transition: width 0.2s ease-out
        list-style-type: none
        text-align:right;
        span
          background-color:#3385FF
          display: none
      .active
        width: 80px
        span
            display: inline
      .normal
        background: #999 url(../image/map/maptype/shiliang.png) no-repeat
      .earch
        background: #999 url(../image/map/maptype/dixing.png) no-repeat
      .terrain
        background: #999 url(../image/map/maptype/yingxiang.png) no-repeat
</style>
