<template>
  <div class="isearch-board" :style="[showMove?{cursor:'move'}:null]" @click.stop="contentClick">
    <div class="info-window-title" @mousedown="contentMouseDown">
      <div class="info-window-title-value">属性信息</div>
      <div class="info-window-close" @click="closeClick"></div>
    </div>
    <div class="info-window-layer-select-Content" @click.stop="layerSelectClick">
      <input type="text" class="info-window-layer-select" disabled="true" :value="currentInfo.currentName">
      <div :class="[isFold?'info-window-layer-select-icon-fold':'info-window-layer-select-icon-spread']"></div>
    </div>
    <ul class="info-window-layer-select-list" v-show="!isFold">
      <li class="list-item" v-for="item in layerInfo" @click="itemClick(item)">
        <span class="show-info">{{item.currentName}}</span>
      </li>
    </ul>
    <div class="info-window-content">
      <ul class="info-window-content-ul">
        <li class="info-item" v-for="(value,key) in resultData" v-if="isShow(key)">
          <span class="field-key">{{key | getAliasName(fieldsInfo)}}</span>
          <span class="field-value">{{value}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ISearchBoard',
  props: ['barVm'],
  data() {
    return {
      isFold: true,
      // 控制鼠标点下后变成移动的样式
      showMove: false,
      // 用来记录鼠标的位置（移动的时候使用）
      position: {
        x: null,
        y: null
      }
    };
  },
  computed: {
    layerInfo() {
      return this.barVm.layerInfo;
    },
    currentInfo() {
      return this.barVm.currentInfo;
    },
    resultData() {
      var featureAttributes = null;
      // 监测查询结果变化
      var resultData = this.barVm.resultData;
      if (resultData) {
        featureAttributes = resultData.features.length > 0 ? resultData.features[0].attributes : null;
      }
      return featureAttributes;
    },
    fieldsInfo() {
      return this.barVm.resultData.fields;
    }
  },
  mounted() {
    //      this.currentInfo = this.barVm.currentInfo;
  },
  filters: {
    // 通过名称获取别名
    getAliasName(fieldname, fields) {
      for (var field in fields) {
        if (fields[field].name === fieldname) {
          return fields[field].alias;
        }
      }
      return fieldname;
    }
  },
  methods: {
    // 过滤resultData不需要的属性
    isShow(key) {
      if (window.isearchNotShowFields === null || window.isearchNotShowFields.length === 0) {
        return true;
      }
      if (window.isearchNotShowFields.indexOf(key) > -1 || window.isearchNotShowFields.indexOf(key.toLocaleLowerCase) > -1) {
        return false;
      } else {
        return true;
      }
    },
    // 鼠标点下的事件，这里为的是可以进行拖动
    contentMouseDown(e) {
      // 改变鼠标指针的形状
      this.showMove = true;
      e = this.fixEvent(e);
      e.preventDefault && e.preventDefault();
      this.position.x = e.clientX - this.$el.offsetLeft;
      this.position.y = e.clientY - this.$el.offsetTop;
      this.$el.onmousemove = this.startMove;
      this.$el.onmouseup = this.endMove;
    },
    // 鼠标落下后的操作
    startMove(e) {
      e = this.fixEvent(e);
      var oLeft = e.clientX - this.position.x;
      var oTop = e.clientY - this.position.y;
      this.$el.style.left = oLeft + 'px';
      this.$el.style.top = oTop + 'px';
    },
    // 鼠标移动结束
    endMove(e) {
      this.showMove = false;  // 改变鼠标指针的形状
      this.$el.onmousemove = this.$el.onmouseup = null;
    },
    // 检查e的值
    fixEvent(e) {
      if (!e) {
        e = window.event;
        e.target = e.srcElement;
        e.layerX = e.offsetX;
        e.layerY = e.offsetY;
      }
      return e;
    },
    closeClick() {
      this.$events.$emit('barItemClick', { vmName: null });
    },
    contentClick() {
      this.isFold = true;
    },
    layerSelectClick() {
      this.isFold = false;
    },
    itemClick(obj) {
      this.barVm.currentInfo = obj;
    }
  }
};
</script>
<style lang="scss">
.isearch-board {
  position: absolute;
  left: 500px;
  top: 150px;
  border-radius: 8px;
  height: 400px;
  overflow: auto;
  width: 500px;
  background-color: white;
  z-index: 10;
  .info-window-title {
    position: relative;
    height: 46px;
    background-color: white;
    background: linear-gradient(to top, #1f3559, #172234);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#0a162c', endColorstr='#0a2f4d', GradientType=0);
    font-size: 16px;
    color: #fff;
    .info-window-title-value {
      position: absolute;
      left: 0px;
      line-height: 46px;
      padding-left: 18px;
    }
    .info-window-close {
      position: absolute;
      right: 13px;
      width: 24px;
      height: 46px;
      padding: 0 5px;
      background-image: url(../../image/close.png);
      background-repeat: no-repeat;
      background-position: center;
    }
  }
  .info-window-layer-select-Content {
    position: relative;
    height: 40px;
    padding: 0 45px 0 18px;
    background: #E4E8EB;
    .info-window-layer-select {
      width: 100%;
      border: 0;
      height: 40px;
      padding: 0;
      background: #E4E8EB;
      outline: none;
      font-size: 14px;
      color: #1e2e4a;
    }
    .info-window-layer-select-icon-spread {
      position: absolute;
      top: 0px;
      right: 13px;
      width: 24px;
      height: 40px;
      padding: 0 5px;
      background-image: url(../../image/spread.png);
      background-repeat: no-repeat;
      background-position: center;
    }
    .info-window-layer-select-icon-fold {
      position: absolute;
      top: 0px;
      right: 13px;
      width: 24px;
      height: 40px;
      padding: 0 5px;
      background-image: url(../../image/fold.png);
      background-repeat: no-repeat;
      background-position: center;
    }
  }
  .info-window-layer-select-list {
    position: absolute;
    width: 100%;
    max-height: 200px;
    top: 86px;
    margin: 0;
    padding: 0;
    background: #1e2e4a;
    overflow: auto;
    opacity: 0.9;
    font-size: 14px;
    color: #fff;
    .list-item {
      height: 32px;
      line-height: 32px;
      padding: 0 18px;
      &:hover {
        background: #e5e8eb;
        color: #1e2e4a;
        cursor: pointer;
      }
      .show-info {
        display: inline-block;
        width: 100%;
        height: 100%;
      }
    }
  }
  .info-window-content {
    height: 314px;
    overflow: auto;
    .info-window-content-ul {
      margin: 0;
      padding: 0;
      list-style-type: none;
      font-size: 14px;
      color: #333;
      .info-item {
        height: 32px;
        line-height: 32px;
        padding: 0 38px;
        font-size: 0;
        .field-key {
          display: inline-block;
          width: 30%;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .field-value {
          display: inline-block;
          width: 70%;
          border-left: 1px solid #E4E8EB;
          box-sizing: border-box;
          white-space: nowrap;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          padding-left: 20px;
        }
      }
    }
  }
}
</style>
