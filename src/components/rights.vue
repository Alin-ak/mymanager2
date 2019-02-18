<template>
  <el-card class="box">
    <curBread lve1="角色列表" lve2="权限列表"></curBread>
    <el-table  :data="list" stripe border style="width: 100%" class="tableM" height="380">
      <el-table-column type="index" label="#" width="100"></el-table-column>  
      <el-table-column prop="authName" label="权限名称" width="280"></el-table-column>
      <el-table-column prop="path" label="路径" width="280"></el-table-column>
      <el-table-column prop="level" label="层级" width="360">
        <template slot-scope="scope">
          <span v-if="scope.row.level==='0'">一级</span>
          <span v-if="scope.row.level==='1'">二级</span>
          <span v-if="scope.row.level==='2'">三级</span>
        </template>
       
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
    data () {
         return {
             tableData:{},
             list:[],
             loading:true
         }
      },
  created() {
    this.getTableData();
  },
  
  methods: {
      
    // 获取权限列表数据 
    async getTableData() {
      // 封装axios 插件
      const res = await this.$http.get(`rights/list`);
      // console.log(res)
      this.list = res.data.data
      
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.tableM {
    margin-top: 20px;
    
}
</style>
