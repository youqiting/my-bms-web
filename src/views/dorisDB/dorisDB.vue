<template>
   <div>
       <el-row class="margin-b-20">
           <el-col :span="12">
               <el-select v-model="dorisDb" filterable placeholder="请选择doris数据库" size="small" @change="queryExternalTable()">
                   <el-option
                       v-for="item in dorisDbList"
                       :key="item.database"
                       :label="item.database"
                       :value="item.database"
                   >
                   </el-option>
               </el-select>
           </el-col>
           <el-col :span="12" class="text-right">
               <el-button type="primary" size="small" @click="showDorisDialog()">创建doris数据库</el-button>
           </el-col>
       </el-row>
        <base-table
            :data="tableData"
            :columns="columns"
            :handleObj="handleObj"
            @deleteExternalTable="deleteExternalTable($event.row.externalId)"
        ></base-table>

        <!-- 弹窗 创建doris数据库 -->
        <el-dialog width="400px" title="dorisdb" center :visible.sync="dorisDialog">
            <el-input v-model="dorisData.name" placeholder="请输入doris数据库名称"  maxlength="30" show-word-limit></el-input>
            <span slot="footer">
                <el-button class="width-90" type="danger" size="small" @click="dorisDialog = false">取消</el-button>
                <el-button class="width-90" type="success" size="small" :loading="loading" @click="createDorisDb()">创建</el-button>
            </span>
        </el-dialog>
   </div>
</template>
<script>
import {isDbName} from '@/utils/validate'
export default {
   name:"",
   data(){
      return{
            columns: [
                {prop: "tableName",label: "外部表名"},
                {prop: "dorisdbName",label: "doris数据库名称"},
                {prop: "resourceName",label: "外部资源名称"},
                {prop: "createTime",label: "创建时间",formatDate:"yyyy-MM-dd HH:mm"},
            ],
            handleObj: {
                btns: [
                    {
                        name: "删除",
                        type: "text",
                        size: "small",
                        funName: "deleteExternalTable",
                    },
                ],
            },
            tableData:[],
            dorisDbList:[],
            dorisDb: "",
            // 弹窗
            dorisDialog: false,
            dorisData:{
                name:"",
            },
            loading: false,
      }
   },
   created(){
       this.queryDorisDb()
   },
   methods:{
    //    doris
       queryDorisDb(){
            this.dorisDbList = []
            this.$api.schemaApi.queryDorisDb().then((res) => {
                if(Array.isArray(res.resultData)){
                    this.dorisDbList = [...res.resultData]
                }
            }).catch((err) => {	});
       },
       createDorisDb(){
            if(this.$util.isEmpty(this.dorisData.name)){
                this.$Message.warning('请输入doris数据库名称')
                return;
            }
            if(!isDbName(this.dorisData.name)){
                this.$Message.warning('请输入正确的doris数据库名称')
                return;
            }
            this.loading = true
            this.$api.schemaApi.createDorisDb({ dorisDbName: this.dorisData.name }).then((res) => {
                this.loading = false
                this.queryDorisDb();
                this.$Message.success("创建成功")
                this.dorisDialog = false;
            }).catch((err) => { this.loading = false	});
       },
       showDorisDialog(){
           this.dorisData.name = ""
            this.dorisDialog = true;
       },
    // 外部表
       queryExternalTable(){
           this.tableData = [];
           this.$api.schemaApi.queryExternalTable({ dorisDbName: this.dorisDb}).then((res) => {
               if(Array.isArray(res.resultData)){
                    this.tableData = [...res.resultData]
                }
           }).catch((err) => {	});
       },
        deleteExternalTable(externalId){
            this.$api.schemaApi.deleteExternalTable({ externalId }).then((res) => {
                this.$Message.success("删除外部表成功")
                this.queryExternalTable();
            }).catch((err) => {	});
        },
   }
}
</script>
<style lang="scss" scoped>

</style>