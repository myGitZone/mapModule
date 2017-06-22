<template>
    <div class="search-board">
        <div id="search-input">
            <input type="text" id="input-keyword" v-model="keywords" ref="input" placeholder="请输入查询地址" @keyup.enter="searchHandler">
            <button @click="searchHandler">查询</button>
        </div>
        <div id="baidumapcontain"></div>
        <div id="search-result">
            <ul class="poi-list">
                <template v-for="item in resultData">
                    <li class="poi-item" @click="locate(item.point)">
                        <span><div class="icon" :style="{backgroundPositionX:item.imgPosi+'px'}"></div>{{item.title}}</span>
                        <span>{{item.address}}</span>
                    </li>
                    <hr>
                </template>
            </ul>
        </div>
    </div>
</template>
<script>
import CoorConvertClass from '../../bmap/coordinateConvert';
// import pointLabelPng from '../../../../../assets/img/map/search/PointLabel.png';
import pointLabel1 from '../../image/map/search/red_1.png';
import pointLabel2 from '../../image/map/search/red_2.png';
import pointLabel3 from '../../image/map/search/red_3.png';
import pointLabel4 from '../../image/map/search/red_4.png';
import pointLabel5 from '../../image/map/search/red_5.png';
import pointLabel6 from '../../image/map/search/red_6.png';
import pointLabel7 from '../../image/map/search/red_7.png';
import pointLabel8 from '../../image/map/search/red_8.png';
import pointLabel9 from '../../image/map/search/red_9.png';
import pointLabel10 from '../../image/map/search/red_10.png';
export default {
    name: 'SearchBoard',
    data() {
        return {
            msg: 'search-board',
            keywords: '',
            localSearch: null,
            maxLength: 10,
            resultData: [],
            imgObj: {}
        };
    },
    props: ['barVm'],
    activated: function () {
        this.$nextTick(function () {
            this.$refs.input.focus();
        });
    },
    deactivated: function () {
        // 隐藏标注图层
        this.barVm.mapConfig.map.searchPointGhLayer.hide();
    },
    mounted: function () {
        this.initBmapControl();
        this.imgObj = {
            pointLabel1,
            pointLabel2,
            pointLabel3,
            pointLabel4,
            pointLabel5,
            pointLabel6,
            pointLabel7,
            pointLabel8,
            pointLabel9,
            pointLabel10
        };
    },
    methods: {
        searchHandler: function () {
            if (!this.barVm.mapConfig.map.getLayer('searchPointGhLayer')) {
                this.barVm.mapConfig.map.addLayer(this.barVm.mapConfig.map.searchPointGhLayer);
            }
            this.barVm.mapConfig.map.searchPointGhLayer.show();
            if (this.keywords) {
                this.localSearch.search(this.keywords);
            }
        },
        initBmapControl: function () {
            // 添加地图标注图层
            if (!this.barVm.mapConfig.map.searchPointGhLayer) {
                this.barVm.mapConfig.map.searchPointGhLayer = new this.barVm.arcgisClass.GraphicsLayer({
                    id: 'searchPointGhLayer'
                });
            }
            let bmap = new window.BMap.Map('baidumapcontain');
            this.localSearch = new window.BMap.LocalSearch(bmap);
            bmap.centerAndZoom('昆明', 12);
            this.localSearch.setSearchCompleteCallback(searchResult => {
                this.clearOldPoint();
                this.resultData.length = 0;
                if (searchResult.getNumPois() > 0) {
                    for (let i = 0; i < this.maxLength; i++) {
                        var bPoi = searchResult.getPoi(i);
                        var tdPoi = this.coorConvert(bPoi);
                        var point = new this.barVm.arcgisClass.Point({
                            spatialReference: {
                                'wkid': 4326
                            },
                            type: 'point',
                            x: tdPoi.lon,
                            y: tdPoi.lat
                        });
                        bPoi.point = point;
                        bPoi.imgObj = this.imgObj['pointLabel' + (i + 1)];
                        bPoi.imgPosi = -i * 21;
                        this.resultData.push(bPoi);
                        this.drawPointAtMap(bPoi);
                    }
                }
            });
        },
        clearOldPoint: function () {
            this.barVm.mapConfig.map.searchPointGhLayer.clear();
        },
        drawPointAtMap: function (poi) {
            var pms = new this.barVm.arcgisClass.PictureMarkerSymbol(poi.imgObj, 21, 31);
            var attributes = {
                title: poi.title,
                address: poi.address,
                telephone: poi.phoneNumber
            };
            var graphic = new this.barVm.arcgisClass.Graphic(poi.point, pms, attributes);
            this.barVm.mapConfig.map.searchPointGhLayer.add(graphic);
        },
        locate: function (point) {
            this.barVm.mapConfig.map.centerAndZoom(point, 16);
        },
        coorConvert: function (bPoi) {
            var bdtogcjPoint = CoorConvertClass.bd_decrypt(bPoi.point.lat, bPoi.point.lng);
            var gcjtowgsPoint = CoorConvertClass.gcj_decrypt_exact(bdtogcjPoint.lat, bdtogcjPoint.lon);
            return gcjtowgsPoint;
        }
    }
};
</script>
<style lang="scss">
.search-board {
    position: relative;
    width: 100%;
    text-align: center;
    #search-input {
        #input-keyword {
            margin: 5px;
            line-height: 25px;
        }
    }
    #search-result {
        text-align: left;
        .poi-list {
            .poi-item {
                padding: 0 10px;
                cursor: pointer;
                span {
                    line-height: 25px;
                    color: #fff;
                    .icon {
                        display: inline-block;
                        margin: 0 5px;
                        width: 21px;
                        height: 31px;
                        background: url(../../image/map/search/PointLabel.png) no-repeat;
                    }
                }
            }
        }
    }
}
</style>
