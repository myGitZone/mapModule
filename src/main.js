// esri地图
import EsriMap from './map_module/map/esrimap';
// 图例
import Legend from './map_module/maptool/legend';
// 所有的工具
import {
  FullExtent,
  FullScreen,
  ISearchBoard,
  ISearch,
  LocationBoard,
  Location,
  Measurement,
  MeasurementBoard,
  RenderClear,
  SearchBoard,
  Search,
  ZoomIn,
  ZoomOut
} from './map_module/maptool/toolbar';
// 地图类型（矢量、影像）
import MapType from './map_module/maptool/mapType';
// 鹰眼
import OverViewMap from './map_module/maptool/overviewMap';

var components = [
  EsriMap,
  Legend,
  MapType,
  OverViewMap,
  FullExtent,
  FullScreen,
  ISearchBoard,
  ISearch,
  LocationBoard,
  Location,
  Measurement,
  MeasurementBoard,
  RenderClear,
  SearchBoard,
  Search,
  ZoomIn,
  ZoomOut
];
const install = function(Vue) {
  components.map(function(component) {
    Vue.component(component.name, component);
  });
};

export default {
  EsriMap,
  Legend,
  MapType,
  OverViewMap,
  FullExtent,
  FullScreen,
  ISearchBoard,
  ISearch,
  LocationBoard,
  Location,
  Measurement,
  MeasurementBoard,
  RenderClear,
  SearchBoard,
  Search,
  ZoomIn,
  ZoomOut,
  install
};

// // esri地图
// import EsriMap from './map_module/map/esrimap';

// const components = [
//   EsriMap
// ];

// function install(Vue, _) {
//   components.forEach(component => {
//     Vue.component(component.name, component);
//   });
// };
// export default {
//   EsriMap,
//   install
// };
