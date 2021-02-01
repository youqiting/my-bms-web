<template>
    <div>
        <el-row type="flex" align="flex-end">
            <el-col :span="12" class="font-14">                
                <el-breadcrumb class="margin-b-10" separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item v-for="(step_title, step_i) in getDbStepList">
                        <span @click="backStep(step_i+1)" class="c-pointer" :class="(dbStep == step_i+1)?'color-text':'color-subText'">{{step_title}}</span>
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </el-col>
            <el-col :span="12" class="text-right margin-b-10">
                <el-button v-show="dbStep == 1" type="primary" size="small" @click="showDbDialog()">创建数据库</el-button>
            </el-col>
        </el-row>
        <el-form v-show="dbStep > 1" :model="searchForm" ref="searchForm" :rules="searchFormRules" :inline="true">
            <el-form-item label="服务地址" prop="dbHost">
                <el-input v-model="searchForm.dbHost" placeholder="数据源服务地址"  size="small" :disabled="dbStep == 3" :validate-event="false"></el-input>
            </el-form-item>
            <el-form-item label="端口" prop="dbPort">
                <el-input v-model="searchForm.dbPort" placeholder="数据源端口"  size="small" :disabled="dbStep == 3" :validate-event="false"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="dbName">
                <el-input v-model="searchForm.dbName" placeholder="数据源名称"  size="small" :disabled="dbStep == 3" :validate-event="false"></el-input>
            </el-form-item>
            <el-form-item label="账号" prop="dbUsername">
                <el-input v-model="searchForm.dbUsername" placeholder="数据源账号"  size="small" :disabled="dbStep == 3" :validate-event="false"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="dbPassword">
                <el-input  show-password v-model="searchForm.dbPassword" placeholder="数据源密码"  size="small" :disabled="dbStep == 3" :validate-event="false"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="small" :disabled="dbStep == 3" @click="resetForm()">重置</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" :disabled="dbStep == 3" @click="submitForm()">确定</el-button>
            </el-form-item>
        </el-form>
        <div v-show="dbStep > 1" class="line"></div>
        <transition name="block-fade">
            <div v-if="dbStep == 1">
                <base-table
                    :data="dbTableData"
                    :columns="dbColumns"
                >
                    <el-table-column slot="action" label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="queryTableSchemas(scope.row)">查看表结构</el-button>
                            <el-button type="text" size="small" @click="resource(scope.row)">外部资源</el-button>
                            <el-button type="text" size="small" @click="showDbDialog(scope.row)">修改</el-button>
                            <el-popconfirm title="确定删除这条数据库吗？" @confirm="deleteDb(scope.row)">
                                <el-button class="margin-l-10 color-danger" type="text" size="small" slot="reference">删除</el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </base-table>
            </div>
        </transition>
        <transition name="block-fade">
            <div v-if="dbStep == 2">
                <base-table
                    :data="sourceTableData"
                    :columns="sourceColumns"
                    :handleObj="sourceHandleObj"
                    @queryColumnsSchemas="queryColumnsSchemas($event.row)"
                    @showExternalTableDialog="showExternalTableDialog($event.row)"
                ></base-table>
            </div>
        </transition>
        <transition name="block-fade">
            <div v-if="dbStep == 3">
                <base-table
                    :data="DetailTableData"
                    :columns="DetailColumns"
                ></base-table>
            </div>
        </transition>

        
        <!-- 弹窗 创建数据库 -->
        <el-dialog width="400px" :title="(dbDialogForm.dbId ?'修改':'创建')+'数据库'" center :visible.sync="dbDialog" :before-close="cancelDbDialog">
            <el-form v-if="dbDialog" :model="dbDialogForm" ref="dbDialogForm" :rules="searchFormRules" label-width="80px" label-position="left">
                <el-form-item label="服务地址" prop="dbHost">
                    <el-input v-model="dbDialogForm.dbHost" placeholder="服务地址" :disabled="dbDialogForm.dbId != null" size="small"></el-input>
                </el-form-item>
                <el-form-item label="端口" prop="dbPort">
                    <el-input v-model="dbDialogForm.dbPort" placeholder="端口" :disabled="dbDialogForm.dbId != null" size="small"></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="dbName">
                    <el-input v-model="dbDialogForm.dbName" placeholder="名称" :disabled="dbDialogForm.dbId != null" size="small"></el-input>
                </el-form-item>
                <el-form-item label="账号" prop="dbUsername">
                    <el-input v-model="dbDialogForm.dbUsername" placeholder="账号" size="small"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="dbPassword">
                    <el-input  show-password v-model="dbDialogForm.dbPassword" placeholder="密码" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button class="width-90" type="danger" size="small" :loading="loading" @click="cancelDbDialog()">取消</el-button>
                <el-button class="width-90" type="success" size="small" :loading="loading" @click="comfirmDbDialog()">确定</el-button>
            </span>
        </el-dialog>
        <!-- 弹窗 外部资源-->
        <el-dialog :width="resourceData.resultData.length > 0?'600px':'400px'" title="External Resource" center :visible.sync="resourceDialog">
            <div v-if="resourceData.resultData.length > 0">
                <el-table :data="resourceData.resultData" height="425">
                    <el-table-column label="name" prop="name"></el-table-column>
                    <el-table-column label="resourcetype" prop="resourcetype"></el-table-column>
                    <el-table-column label="item" prop="item"></el-table-column>
                    <el-table-column label="value" prop="value"></el-table-column>
                </el-table>
            </div>
            <div v-else class="common-grey-tip text-center">该数据库未创建外部资源</div>
            <span slot="footer">
                <el-button class="width-90" type="danger" size="small" :loading="loading" @click="resourceDialog = false">取消</el-button>
                <el-button v-if="resourceData.resultData.length > 0" class="width-90" type="success" size="small" :loading="loading" @click="deleteResource()">删除</el-button>
                <el-button v-else class="width-90" type="success" size="small" :loading="loading" @click="createResource()">创建</el-button>
            </span>
        </el-dialog>
        <!-- 弹窗 外部表-->
        <el-dialog width="400px" title="Create External Table" center :visible.sync="externalTableDialog" :before-close="cancelExternal">
            <el-form :model="externalTableForm"  class="text-left no-msg" ref="externalTableForm" :rules="externalTableFormRules" label-width="100px" label-position="left">
                <el-form-item label="doris数据库" prop="dorisdbName">
                    <el-select class="width-full" v-model="externalTableForm.dorisdbName" filterable placeholder="请选择doris数据库" size="small">
                        <el-option
                            v-for="item in dorisDbList"
                            :key="item.database"
                            :label="item.database"
                            :value="item.database"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="表名" prop="tableName">
                    <el-input v-model="externalTableForm.tableName" disabled size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button class="width-90" type="danger" size="small" :loading="loading" @click="cancelExternal()">取消</el-button>
                <el-button class="width-90" type="success" size="small" :loading="loading" @click="comfirmExternal()">创建</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: "dataSource",
    data(){
        return{
            searchForm:{
                dbHost: "",
                dbPort: "",
                dbName: "",
                dbUsername: "",
                dbPassword: "",
            },
            searchFormStore:{},
            searchFormRules:{
                dbHost:[{ required: true, message: '请输入服务地址', trigger: 'change'}],
                dbPort:[{ required: true, message: '请输入端口', trigger: 'change'}],
                dbName:[{ required: true, message: '请输入名称', trigger: 'change'}],
                dbUsername:[{ required: true, message: '请输入账号', trigger: 'change'}],
                dbPassword:[{ required: true, message: '请输入密码', trigger: 'change'}],
            },
            dbStep: 1,
            dbStepList:["数据库信息","数据源列表","数据源详情"],
            // 数据库信息
            dbColumns: [
                {prop: "dbName",label: "名称"},
                {prop: "dbHost",label: "服务地址"},
                {prop: "dbPort",label: "端口"},
                {prop: "dbUsername",label: "账号"},
                {prop: "resourceName",label: "外部资源名称"},
            ],
            dbTableData: [],
            // 数据源列表
            sourceTableData: [],
            sourceColumns: [
                {prop: "tableName",label: "表名"},
                {prop: "tableType",label: "表类型"},
                {prop: "tableRows",label: "数据库引擎"},
                {prop: "tableComment",label: "表说明"},
                {prop: "createTime",label: "创建时间",formatDate:"yyyy-MM-dd HH:mm"},
                {prop: "updateTime",label: "更新时间",formatDate:"yyyy-MM-dd HH:mm"},
            ],
            sourceHandleObj: {
                btns: [{
                        name: "查看表结构",
                        type: "text",
                        size: "small",
                        funName: "queryColumnsSchemas",
                    },{
                        name: "创建外部表",
                        type: "text",
                        size: "small",
                        funName: "showExternalTableDialog",
                    },
                ],
            },
            //  数据源详情
            DetailColumns: [
                {prop: "columnName",label: "字段名称"},
                {prop: "dataType",label: "数据类型"},
                {prop: "columnDefault",label: "默认值",defaultValue:'null'},
                {prop: "characterMaximumLength",label: "最大长度"},
                {prop: "isNullable",label: "是否为空"},
                {prop: "columnComment",label: "字段说明",defaultValue:' '},
                {prop: "columnType",label: "字段类型"},
            ],
            DetailTableData:[],
            // 弹窗
            // 创建数据库
            dbDialog: false,
            dbDialogForm:{
                dbId: null,
                dbHost: "",
                dbPort: "",
                dbName: "",
                dbUsername: "",
                dbPassword: "",
            },
            // 外部资源
            resourceDialog: false,
            resourceData: {
                dbId: "",
                resultData:[]
            },
            // 外部表
            externalTableDialog: false,
            externalTableForm:{
                dbId: "",
                dorisdbName: "",
                tableName: ""
            },
            externalTableFormRules:{
                dorisdbName:[ {required: true, message:"请输入doris数据库", trigger: 'blur'}],
            },          
            dorisDbList:[],
            // 
            loading: false,
        }
    },
    computed:{
        getDbStepList(){
            return this.dbStepList.slice(0, this.dbStep)
        }
    },
    created(){
        this.queryDb()
        this.searchFormStore = {...this.searchForm}
    },
    methods:{
        // step 1
        queryDb(){
            this.$api.dbApi.queryDb().then((res) => {
                this.dbTableData = [...res.resultData]
            }).catch((err) => {	});
        },
        resource(row){
            var params = {
                resourceName: row.resourceName
            }
            this.resourceData.dbId = row.dbId
            this.resourceData.resultData = []
            this.$api.schemaApi.queryResources(params).then((res) => {
                if(Array.isArray(res.resultData)){
                    this.resourceData.resultData = [...res.resultData]
                }
                this.$nextTick(()=>{
                    this.resourceDialog = true;
                })
            }).catch((err) => {	});
        },
        createResource(){
            this.loading = true
            this.$api.schemaApi.createResource({dbId: this.resourceData.dbId}).then((res) => {
                this.queryDb()
                this.resourceDialog = false;
                this.loading = false
            }).catch((err) => {	this.loading = false });
        },
        deleteResource(){
            this.loading = true
            this.$api.schemaApi.deleteResource({dbId: this.resourceData.dbId}).then((res) => {
                this.queryDb()
                this.resourceDialog = false;
                this.loading = false
            }).catch((err) => {	this.loading = false});
        },
        showDbDialog(row){
            this.dbDialog = true;
            this.$nextTick(()=>{
                if(!this.$util.isEmpty(row)){
                    this.dbDialogForm.dbId = row.dbId
                        this.dbDialogForm.dbHost = row.dbHost
                        this.dbDialogForm.dbPort = row.dbPort
                        this.dbDialogForm.dbName = row.dbName
                        this.dbDialogForm.dbUsername = row.dbUsername
                        this.dbDialogForm.dbPassword = row.dbPassword
                }else{
                    this.dbDialogForm.dbId = null
                }
            })
        },
        cancelDbDialog(){
            this.$refs.dbDialogForm.resetFields();
            this.$nextTick(()=>{
                this.dbDialog = false;
            })
        },
        comfirmDbDialog(){
            this.$refs.dbDialogForm.validate(valid=>{
                if(valid){
                    this.loading = true
                    let params = {
                        dbUsername: this.dbDialogForm.dbUsername,
                        dbPassword: this.dbDialogForm.dbPassword,
                    }
                    if(this.$util.isEmpty(this.dbDialogForm.dbId)){
                        params.dbHost = this.dbDialogForm.dbHost
                        params.dbPort = this.dbDialogForm.dbPort
                        params.dbName = this.dbDialogForm.dbName
                        this.$api.dbApi.createDb(params).then((res) => {
                            this.$Message.success("创建成功")
                            this.queryDb()
                            this.cancelDbDialog()
                            this.loading = false
                        }).catch((err) => {	});
                    }else{
                        params.dbId = this.dbDialogForm.dbId
                        this.$api.dbApi.updateDb(params).then((res) => {
                            this.$Message.success("修改成功")
                            this.queryDb()
                            this.cancelDbDialog()
                            this.loading = false
                        }).catch((err) => {	});
                    }
                }
            })
        },
        deleteDb(row){
            this.$api.dbApi.deleteDb({ dbId: row.dbId }).then((res) => {                
                this.$Message.success("删除成功")
                this.queryDb()
            }).catch((err) => {	});
        },
        //  step 2
        queryTableSchemas(row){
            this.externalTableForm.dbId = row.dbId
            let searchForm = {
                dbName: row.dbName,
                dbUsername: row.dbUsername,
                dbPassword: row.dbPassword,
                dbPort: row.dbPort,
                dbHost: row.dbHost,
            }
            this.$set(this, "searchForm", searchForm)
            this.$set(this, "searchFormStore", searchForm)
            this.sourceTableData = [];
            this.dbStep = 2;
            var params = {
                databaseName: this.searchForm.dbName,
                username: this.searchForm.dbUsername,
                password: this.searchForm.dbPassword,
                port: this.searchForm.dbPort,
                host: this.searchForm.dbHost,
            }
            this.$api.schemaApi.queryTableSchemas(params).then((res) => {
                this.sourceTableData = [...res.resultData]
            }).catch((err) => {	});
        },
        showExternalTableDialog(row){
            this.dorisDbList = []
            this.$api.schemaApi.queryDorisDb().then((res) => {
                this.externalTableForm.tableName = row.tableName;
                if(Array.isArray(res.resultData)){
                    this.dorisDbList = [...res.resultData]
                }
                this.externalTableDialog = true;
            }).catch((err) => {	});            
        },
        cancelExternal(){
            this.$refs.externalTableForm.resetFields();
            this.$nextTick(()=>{
                this.externalTableDialog = false;
            })
        },
        comfirmExternal(){
            this.$refs.externalTableForm.validate(valid=>{
                if(valid){
                    this.createExternalTable();
                }
            })
        },
        createExternalTable(){//创建外部表
            this.loading = true
            let params = {
                dbId: this.externalTableForm.dbId,
                dorisdbName: this.externalTableForm.dorisdbName,                
                tableName: this.externalTableForm.tableName,
                databaseName: this.searchFormStore.dbName,
                username: this.searchFormStore.dbUsername,
                password: this.searchFormStore.dbPassword,
                port: this.searchFormStore.dbPort,
                host: this.searchFormStore.dbHost,
            }
            this.$api.schemaApi.createExternalTable(params).then((res) => {
                this.$Message.success("创建成功")
                this.cancelExternal()
                this.loading = false
            }).catch((err) => {	this.loading = false });
        },
        resetForm(){
            this.$refs.searchForm.resetFields()
        },
        submitForm(){
            this.searchFormStore = {...this.searchForm}
            this.dbStep = 2;
            this.$refs.searchForm.validate(valid=>{
                if(valid){
                    this.sourceTableData = [];
                    var params = {
                        databaseName: this.searchForm.dbName,
                        username: this.searchForm.dbUsername,
                        password: this.searchForm.dbPassword,
                        port: this.searchForm.dbPort,
                        host: this.searchForm.dbHost,
                    }
                    this.$api.schemaApi.queryTableSchemas(params).then((res) => {
                        this.sourceTableData = [...res.resultData]
                    }).catch((err) => {	});
                }
            })
        },
        // step 3
        queryColumnsSchemas(row){
            this.dbStep = 3
            this.searchForm = {...this.searchFormStore}
            this.DetailTableData = []
            var params = {
                tableName: row.tableName,
                databaseName: this.searchForm.dbName,
                username: this.searchForm.dbUsername,
                password: this.searchForm.dbPassword,
                port: this.searchForm.dbPort,
                host: this.searchForm.dbHost,
            }
            this.$api.schemaApi.queryColumnsSchemas(params).then((res) => {
                this.DetailTableData = [...res.resultData]
            }).catch((err) => {	});
        },
        backStep(step){
            this.searchForm = {...this.searchFormStore}
            if(!this.$util.isEmpty(step)){
                this.dbStep = step
            }else{
                this.dbStep = this.dbStep - 1;
            }
        },
    }
}
</script>
<style lang="scss" scoped>
@import "@/styles/variables.scss";
.line{
    border-top: 4px dotted $color-border;
    margin-bottom: 20px;
}
.back-posi{
    position: absolute;
    left: 20px;
    bottom: 0;
    color: $color-blue;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
}
</style>