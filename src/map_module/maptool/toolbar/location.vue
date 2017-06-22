<template>
  <div class="location-container" @click="changeBoardState">
    <p>{{curLocation}}</p>
  </div>
</template>
<script>
import dashboard from './location-board';
export default {
  name: 'Location',
  data() {
    return {
      dashboard,
      curLocation: '',
      curMapLevel: -1,
      urlConfig: [
        {
          minLevel: 0,
          maxLevel: 13,
          url: 'http://' + window.gisServerIp + '/arcgis/rest/services/GISIOC/jc_town_wgs84_dt/MapServer',
          field: {
            id: 'objectid_1',
            name: 'name'
          },
          index: 0,
          dataArray: []
        },
        {
          minLevel: 13,
          maxLevel: 19,
          url: 'http://' + window.gisServerIp + '/arcgis/rest/services/GISIOC/jc_xzqh_wgs84_dt/MapServer',
          field: {
            id: 'qhdm',
            name: 'qhmc'
          },
          index: 2,
          dataArray: []
        }
      ],
      curUrlConfig: null,
      serverUrl: '',
      identifyTask: null,
      identifyParams: null,
      showBarBoard: false
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
  watch: {
    mapConfig: function (val, oldVal) {
      if (val.map != null && oldVal.map == null) {
        this.getMapZoomLevel();
        this.mapConfig.map.on('zoom', this.getMapZoomLevel);
        this.getLayerData();
        this.getIdentifyConfig();
        this.locationIdentify();
        this.mapConfig.map.on('extent-change', this.locationIdentify);
      }
    }
  },
  mounted: function () {
    this.$events.$emit('barItemBoardInited', this.$options.name, this.dashboard, this);
  },
  methods: {
    getMapZoomLevel: function () {
      this.curMapLevel = this.mapConfig.map.getLevel();
      this.getServerUrl();
      this.getCurUrlConfig();
    },
    getServerUrl: function () {
      let result = this.urlConfig[0].url;
      this.urlConfig.forEach(item => {
        if (item.minLevel <= this.curMapLevel && item.maxLevel > this.curMapLevel) {
          result = item.url;
          return;
        }
      }, this);
      this.serverUrl = result;
    },
    getCurUrlConfig: function () {
      let result = this.urlConfig[0];
      this.urlConfig.forEach(item => {
        if (item.minLevel <= this.curMapLevel && item.maxLevel > this.curMapLevel) {
          result = item;
          return;
        }
      }, this);
      this.curUrlConfig = result;
    },
    getIdentifyConfig: function () {
      let _self = this;
      this.mapConfig.esriLoader.dojoRequire([
        'esri/tasks/IdentifyParameters'],
        (IdentifyParameters) => {
          _self.identifyParams = new IdentifyParameters();
          _self.identifyParams.tolerance = 3;
          _self.identifyParams.returnGeometry = true;
          _self.identifyParams.layerIds = [0, 1];
          _self.identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
          _self.identifyParams.width = _self.mapConfig.map.width;
          _self.identifyParams.height = _self.mapConfig.map.height;
        });
    },
    locationIdentify: function () {
      let _self = this;
      this.mapConfig.esriLoader.dojoRequire([
        'esri/tasks/IdentifyTask',
        'esri/geometry/Point'],
        (IdentifyTask, Point) => {
          _self.identifyTask = new IdentifyTask(_self.serverUrl);
          _self.identifyParams.geometry = new Point(_self.mapConfig.map.extent.getCenter());
          _self.identifyParams.mapExtent = _self.mapConfig.map.extent;
          _self.identifyTask.execute(_self.identifyParams).addCallback(response => {
            window.dojo.map(response, result => {
              _self.curLocation = result.value;
            });
          });
        });
    },
    changeBoardState: function () {
      this.$events.$emit('barItemClick', { vmName: this.$options.name, boardData: this.curUrlConfig.dataArray });
      this.$events.$emit('initDashboardData', this.curUrlConfig.dataArray);
    },
    getLayerData: function () {
      let _self = this;
      this.mapConfig.esriLoader.dojoRequire([
        'esri/tasks/query',
        'esri/layers/FeatureLayer',
        'esri/geometry/Extent'],
        (Query, FeatureLayer, Extent) => {
          _self.urlConfig.forEach((item) => {
            let url = item.url + '/' + item.index;
            let fealyr = new FeatureLayer(url);
            var query = new Query();
            query.outFields = ['*'];
            query.where = '1=1';
            fealyr.queryFeatures(query, (featureSet) => {
              featureSet.features.forEach(function (feature) {
                let id = feature.attributes[item.field.id];
                let name = feature.attributes[item.field.name];
                let center = feature.geometry.getExtent().getCenter();
                item.dataArray.push({ id, name, center });
              }, _self);
            });
          });
        });
    }
  }
};
</script>
<style lang="scss">
.location-container {
  user-select: none;
  p {
    padding: 0 10px;
    min-width: 150px;
  }
}
</style>
