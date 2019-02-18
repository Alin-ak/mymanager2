<template>

  <el-card class="box">
    <!-- 面包屑导航 -->
    <CurBread lve1="商品管理" lve2="商品列表"></CurBread>
    <!-- 输入搜索框 -->
    <el-row class="rowInput">
      <el-input
        clearable
        placeholder="请输入内容"
        v-model="query"
        class="input-with-select"
        @clear="getAllGoods()"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchGoods()"></el-button>
      </el-input>
      <el-button type="success" plain @click="showAddGoods()">添加商品</el-button>
    </el-row>


    <!-- 数据表格 -->
    <el-table :data="list" style="width: 100%" border height="480">
      <el-table-column type="index" label="#" width="100"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" min-width="400"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)" width="140"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="140"></el-table-column>

      <el-table-column label="创建日期" width="180">
        <template slot-scope="scope">{{scope.row.upd_time | fmtdate }}</template>
      </el-table-column>

   
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            @click="showEditUser(scope.row)"
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            plain
          ></el-button>
          <el-button
            @click="delGoods(scope.row)"
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            plain
          ></el-button>
         
        </template>
      </el-table-column>
    </el-table>
        <!-- 分页 -->
     <el-pagination
      class="pageStyle"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[4, 6, 8, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
     </el-pagination>

  </el-card>
</template>

<script>
export default {
  data() {
    return {
        list:[],
        pagenum:1,
        pagesize:7,
        query:'',
        total:949
    };
  },
  created() {
    this.getAllGoods();
  },
  methods: {

      //删除商品数据
      delGoods(goods) {
          this.$confirm('有种你删一个试试?', '哈哈', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
            // 发送请求
            const res = await this.$http.delete(`goods/${goods.goods_id}`)
            // console.log(res)
            const {meta:{msg,status}} = res.data
            if(status === 200){
                this.$message.success(msg)
            }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      
    // 显示添加商品对话框
    showAddGoods() {},

    // 搜索商品
   searchGoods() {
       
    },

    // 页数发生变化时
    handleCurrentChange(val) {
      // this.pagesize = 1;
      this.pagenum = val;
      this.getAllGoods();
    },
    // 页面条数发生变化时
    handleSizeChange(val) {
      this.pagenum = 1;
      this.pagesize = val;
      this.getAllGoods();
    },
    // 获取商品列表数据
   async getAllGoods() {
        const res = await this.$http.get(`goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
        // console.log(res);
        const {data,meta:{status}} = res.data
        if(status === 200) {
            this.list = data.goods
            
        }
        // console.log(this.list)
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.input-with-select {
  width: 400px;
}
.rowInput{
    margin-top: 20px;
    margin-bottom: 10px;
}
.pageStyle{
    margin-top: 20px;
}
</style>
