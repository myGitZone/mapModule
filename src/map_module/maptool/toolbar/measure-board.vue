<template>
    <div class="measureboard-container">
        <div class="measureboard" ref="measureboard"></div>
    </div>
</template>
<script>
export default {
    name: 'MeasurementBoard',
    data() {
        return {
            meg: 'measure board'
        };
    },
    props: ['barVm'],
    mounted: function () {
        this.barVm.initMeasureBoard(this.$refs.measureboard);
    },
    activated: function () { },
    deactivated: function () {
        this.barVm.mapConfig.map.measurement.clearResult();
        this.barVm.mapConfig.map.measurement.setTool('location', false);
        this.barVm.mapConfig.map.measurement.setTool('distance', false);
        this.barVm.mapConfig.map.measurement.setTool('area', false);
    }
};
</script>
<style lang="scss">
.measureboard-container {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0;
    color: #fff;
}
</style>
