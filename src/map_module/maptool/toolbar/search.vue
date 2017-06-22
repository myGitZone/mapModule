<template>
    <div class="search-container" @click="changeBoardState">
        <div class="icon"></div>
    </div>
</template>

<script>
import '../../bmap/bmapLoader';
import dashboard from './search-board';
export default {
    name: 'Search',
    data() {
        return {
            dashboard,
            arcgisClass: null
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
                this.initEsriLoaders();
                this.$events.$emit('barItemBoardInited', this.$options.name, this.dashboard, this);
            }
        }
    },
    mounted: function () {
        this.$events.$emit('barItemBoardInited', this.$options.name, this.dashboard, this);
    },
    methods: {
        initEsriLoaders: function () {
            this.mapConfig.esriLoader.dojoRequire(['esri/geometry/Point', 'esri/symbols/PictureMarkerSymbol', 'esri/graphic', 'esri/layers/GraphicsLayer'], (Point, PictureMarkerSymbol, Graphic, GraphicsLayer) => {
                this.arcgisClass = { Point, PictureMarkerSymbol, Graphic, GraphicsLayer };
            });
        },
        changeBoardState: function () {
            this.$events.$emit('barItemClick', { vmName: this.$options.name });
        }
    }
};

</script>

<style lang="scss">
.search-container {
    .icon {
        width: 20px;
        height: 20px;
        background-size: contain !important;
        background: #0a2f4d url('../../image/map/toolbar/search.png') no-repeat;
        &:hover {
            background: #0a2f4d url('../../image/map/toolbar/search_selected.png') no-repeat;
        }
    }
}
</style>
