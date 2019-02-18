<template>
  <el-card class="box">
    <CurBread lve1="权限管理" lve2="角色列表"></CurBread>
    <el-button type="info" plain class="mr">添加角色</el-button>

    <el-table class="mr" :data="list" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item :label="">
              <span>{{ props.row.authName }}</span>
            </el-form-item>
            <el-form-item label="所属店铺">
              <span>{{ listC.shop }}</span>
            </el-form-item>
            <el-form-item label="商品 ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="店铺 ID">
              <span>{{ props.row.shopId }}</span>
            </el-form-item>
            <el-form-item label="商品分类">
              <span>{{ props.row.category }}</span>
            </el-form-item>
            <el-form-item label="店铺地址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="商品描述">
              <span>{{ props.row.desc }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <!-- id -->
      <el-table-column label="#" prop="id" width="80"></el-table-column>
      <!-- 角色名称 -->
      <el-table-column label="角色名称" prop="roleName" width="220"></el-table-column>
      <!-- 角色描述 -->
      <el-table-column label="角色描述" prop="roleDesc" width="220"></el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" minwidth="300">
        <el-row>
            <!-- 编辑 -->
          <el-button plain type="primary" icon="el-icon-edit" circle size="mini"></el-button>
            <!-- 删除 -->
          <el-button plain type="danger" icon="el-icon-delete" circle size="mini"></el-button>
            <!-- √ -->
          <el-button plain type="success" icon="el-icon-check" circle size="mini"></el-button>
        </el-row>
      </el-table-column>

    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      listC:[],
      tableData5: [
        {
          id: "12987122",
          name: "好滋好味鸡蛋仔",
          category: "江浙小吃、小吃零食",
          desc: "荷兰优质淡奶，奶香浓而不腻",
          address: "上海市普陀区真北路",
          shop: "王小虎夫妻店",
          shopId: "10333"
        },
        {
          id: "12987123",
          name: "好滋好味鸡蛋仔",
          category: "江浙小吃、小吃零食",
          desc: "荷兰优质淡奶，奶香浓而不腻",
          address: "上海市普陀区真北路",
          shop: "王小虎夫妻店",
          shopId: "10333"
        },
        {
          id: "12987125",
          name: "好滋好味鸡蛋仔",
          category: "江浙小吃、小吃零食",
          desc: "荷兰优质淡奶，奶香浓而不腻",
          address: "上海市普陀区真北路",
          shop: "王小虎夫妻店",
          shopId: "10333"
        },
        {
          id: "12987126",
          name: "好滋好味鸡蛋仔",
          category: "江浙小吃、小吃零食",
          desc: "荷兰优质淡奶，奶香浓而不腻",
          address: "上海市普陀区真北路",
          shop: "王小虎夫妻店",
          shopId: "10333"
        }
      ]
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    async getTableData() {
      const res = await this.$http.get(`roles`);
      console.log(res);
      this.list = res.data.data;
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.mr {
  margin-top: 10px;
  /* margin-bottom: 20px; */
}
</style>
