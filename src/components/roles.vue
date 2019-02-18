<template>
  <el-card class="box">
    <CurBread lve1="权限管理" lve2="角色列表"></CurBread>
    <el-button type="info" plain class="mr">添加角色</el-button>

    <el-table class="mr" :data="list" style="width: 100%">
      <el-table-column type="expand">
        <!-- 所有行列布局都用for嵌套 -->
        <!-- 将表格分成一行两列  布局比例4:20 在第二列再分一行两列 比例为4:20 通过span-->
        <template slot-scope="scope">
          <el-row v-for="(item,i) in scope.row.children" :key="item.id">
            <!-- 第一列 -->
            <el-col :span="4">
              <!-- 一级 -->
              <!-- {{item.id}} -->
              <el-tag
                @close="delRights(scope.row,item)"
                type="success"
                class="tag1"
                closable
              >{{item.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <!-- 第二列 -->
            <el-col :span="20">
              
              <el-row v-for="(item1,i) in item.children" :key="item1.id">
                <!-- 第一列 -->
                <el-col :span="4">
                  <!-- 二级 -->
                  <el-tag
                    @close="delRights(scope.row,item1)"
                    type="danger"
                    class="tag2"
                    closable
                  >{{item1.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <!-- 第二列 -->
                <el-col :span="20">
                  <!-- 三级 -->
                  <el-tag
                    @close="delRights(scope.row,item2)"
                    type="warning"
                    v-for="(item2,i) in item1.children"
                    :key="item2.id"
                    closable
                  >{{item2.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row v-if="scope.row.children.length===0"> 
            <el-col>
              <span>未分配角色</span>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <!-- id -->
      <el-table-column label="#" prop="id" width="80"></el-table-column>
      <!-- 角色名称 -->
      <el-table-column label="角色名称" prop="roleName" width="220"></el-table-column>
      <!-- 角色描述 -->
      <el-table-column label="角色描述" prop="roleDesc" width="220"></el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" min-width="300">
        <template slot-scope="scope">
          <!-- 编辑 -->
          <el-button plain type="primary" icon="el-icon-edit" circle size="mini"></el-button>
          <!-- 删除 -->
          <el-button plain type="danger" icon="el-icon-delete" circle size="mini"></el-button>
          <!-- √ -->
          <el-button
            @click="showRoleRights(scope.row)"
            plain
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 修改权限对话框 -->
    <el-dialog title="编辑角色" :visible.sync="dialogFormVisible">
      <!-- 树形结构 -->
      <el-tree
        ref="treeDom"
        :data="listTree"
        show-checkbox
        node-key="id"
        :default-expanded-keys="expandedKey"
        :default-checked-keys="checkedKey"
        :props="defaultProps"
        default-expand-all
      ></el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleRigths()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      listTree: [],
      dialogFormVisible: false,
      expandedKey: [],
      checkedKey: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      roles: {},
      checkRights: []
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    // 弹出对话框点击确定后角色授权 roles/:roleId/rights rids权限ID列表以 , 分割的权限ID列表
    async editRoleRigths() {
      const arr1 = this.$refs.treeDom.getCheckedKeys();
      const arr2 = this.$refs.treeDom.getHalfCheckedKeys();

      const arr3 = [...arr1, ...arr2];
      //  console.log(arr3);
      // console.log(this.roles.id)
      const res = await this.$http.post(`roles/${this.roles.id}/rights`, {
        rids: arr3.join(",")
      });
      const {
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
        this.dialogFormVisible = false;
      }
    },

    //  点对勾弹出对话框 获取数据 rights/:type
    async showRoleRights(role) {
      this.roles = role;
      this.dialogFormVisible = true;
      const res = await this.$http.get(`rights/tree`);
      const {
        data,
        meta: { status }
      } = res.data;
      if (status === 200) {
        // 将数据赋值给listC
        this.listTree = data;
        //  console.log(this.listTree)
      }
      // 遍历数组取出所有id 赋值给默认全打开的数组  有一个单词可以默认打开
      // this.listTree.forEach(item => {
      //     this.expandedKey.push(item.id)
      //     item.children.forEach(item1 =>{
      //       this.expandedKey.push(item1.id)
      //         item1.children.forEach(item2=>{
      //           this.expandedKey.push(item2.id)
      //         })
      //     })
      // });
      // console.log(role)
      // 遍历当前角色下的权限
      const acc = [];
      role.children.forEach(item => {
        // this.checkedKey.push(item.id)
        item.children.forEach(item1 => {
          // this.checkedKey.push(item1.id)
          item1.children.forEach(item2 => {
            acc.push(item2.id);
          });
        });
      });
      this.checkedKey = acc;
    },

    // 删除角色指定权限 roles/:roleId/rights/:rightId 当前角色的权限是role.children
    async delRights(role, rights) {
      const res = await this.$http.delete(
        `roles/${role.id}/rights/${rights.id}`
      );
      // console.log(res)
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
        role.children = data;
      }
      // 删除成功 把剩余的权限展示出来
      // console.log(data)
      //
    },
    // 获取权限数据
    async getTableData() {
      const res = await this.$http.get(`roles`);

      const {
        meta: { status }
      } = res.data;
      if (status === 200) {
        this.list = res.data.data;
        this.loading = false;
      }
      // console.log(this.list);
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
.tag1,
.tag2 {
  margin-bottom: 10px;
}
</style>
