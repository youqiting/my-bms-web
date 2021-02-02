<template>
  <!-- <el-table :data="data" border ref="baseTable" :height="height"  @selection-change="handleSelectionChange">
        <el-table-column v-for="(item, index) in columns" :key="index" 
            :column-key="item.prop" 
            :prop="item.prop" 
            :label="item.label" 
            :width="item.width || ''"
            :fixed="item.fixed || ''"
            :align="item.align || 'left'"
            :type="item.type || ''"
        ></el-table-column>
  </el-table>-->
  <el-table
   v-loading="loading"
    :class="className"
    :data="data"
    ref="baseTable"
    :height="height"
    :header-cell-style="headerStyle"
    :cell-style="cellStyle"
  >
  <el-table-column
      v-for="(item, index) in columns"
      :key="index"
      :column-key="item.prop"
      :prop="item.prop"
      :label="item.label"
      :width="item.width || ''"
      :fixed="item.fixed || false"
      :align="item.align || 'left'"
      :type="item.type || ''"
    >
    <template slot-scope="scope">
      <span v-if="scope.row[item.prop] && item.formatDate">{{scope.row[item.prop] | dateTime(item.formatDate)}}</span>
      <span v-else-if="scope.row[item.prop] || scope.row[item.prop] == 0">{{scope.row[item.prop]}}{{item.unit || ""}}</span>
      <span v-else>{{item.defaultValue || '--'}}{{item.showDefaultUnit?item.unit:"" || ""}}</span>
    </template>
    </el-table-column>
    
    <slot name="action"></slot>

    <template v-if="handleObj.btns && handleObj.btns.length > 0">
      <el-table-column 
      :prop="handleObj.prop || ''"
      :label="handleObj.label || '操作'"
      :width="handleObj.width || ''"
      :fixed="handleObj.fixed || false"
      :align="handleObj.align || 'left'"
      :type="handleObj.type || ''"
      >
        <template slot-scope="scope">
          <!--扩展按钮-->
          <el-button
            :size="item.size ||'mini'"
            :class="item.classname || ''"
            @click="handleAciton(item.funName, scope.row)"
            v-for="(item,index) in handleObj.btns"
            :key="index"
            :type="item.type?item.type:'primary'"
          >{{item.name}}</el-button>
        </template>
      </el-table-column>
    </template>
    <div slot="empty">
        <p class="text-center">暂无数据</p>
    </div>
  </el-table>
</template>

<script>
import publicStyles from "@/assets/styles/variable.scss";
export default {
  name: "BaseTable",
  props: {
    data: {
      type: Array,
      required: true,
      default: function () {
        return [];
      },
    },
    columns: {
      type: Array,
      required: true,
      default: function () {
        return [];
      },
    },
    handleObj: {
      type: Object,
      default: function () {
        return {};
      },
    },
    loading: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    className: {
      type: String,
      default: function () {
        return "";
      },
    },
    height: {
      type: [String, Number],
    },
    headerStyle: {
      type: Object,
      default: function () {
        return {
          ...this.$util.tableStyle.headerStyle
        };
      },
    },
    cellStyle: {
      type: Object,
      default: function () {
        return {
          ...this.$util.tableStyle.cellStyle
        };
      },
    },
  },
  data() {
    return {
      // headerStyle: {
      //   color: publicStyles.colorText,
      //   "text-align": "center",
      //   background: publicStyles.colorBorder,
      // },
      // cellStyle: {
      //   "text-align": "center",
      //   border: "1px dotted" + publicStyles.colorBorder,
      // },
    };
  },
  methods: {
    handleAciton(funName, row) {
      this.$emit(funName, {
        row: row, //校验失败
      });
    },
  },
};
/*
 参数模板
 columns: [
        {
          prop: "no",
          label: "车牌号",
        },
    ]
 actions:[
        {
          name:"取消免缴",classname:"color-warn", type:"text", size:"small",funName:"getTableRow",
        }
      ],

      <base-table :data="tableData" :columns="columns" :actions="actions" @getTableRow="getTableRow($event.row)">
      </base-table>
*/
</script>
<style scoped>
</style>