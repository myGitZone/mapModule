<template>
  <div class="locationboard-container">
    <ul class="location-list">
      <li v-for="location in locationLst" :key="location.id" class="location-item" @click="locate(location.center)">
        <span>{{location.name}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'LocationBoard',
  data() {
    return {
      msg: 'locationBoard'
    };
  },
  props: ['barVm'],
  computed: {
    locationLst: function () {
      if (this.barVm.curUrlConfig.url) {
        return this.barVm.curUrlConfig.dataArray;
      }
    }
  },
  methods: {
    locate: function (center) {
      this.barVm.mapConfig.map.centerAt(center);
    }
  }
};

</script>
<style lang="scss">
.locationboard-container {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 15px 15px 0 15px;
  color: #fff;
  .location-list {
    list-style: none;
    cursor: pointer;
    .location-item {
      margin: 10px;
      user-select: none;
    }
  }
}
</style>
