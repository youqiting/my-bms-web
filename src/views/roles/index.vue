<template>
    <div>
        Change Roles: 
        <el-button :type="roles=='admin'?'primary':'text'" @click="changeRoles('admin')">admin</el-button>
        <el-button :type="roles=='user'?'primary':'text'"  @click="changeRoles('user')">user</el-button>
    </div>
</template>
<script>
export default {
    name:"",
    data(){
        return{
            roles: "admin"
        }
    },
    methods:{
        changeRoles(roles){
            this.roles = roles;
        }
    }
}
</script>
<style lang="scss" scoped>

</style>