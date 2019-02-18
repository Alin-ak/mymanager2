<template>
  <el-card class="box">
    <!-- 卡片 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- el-row -->
    <el-row class="rowInput">
      <el-input
        clearable
        placeholder="请输入内容"
        v-model="query"
        class="input-with-select"
        @clear="getAllUsers()"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchUsers()"></el-button>
      </el-input>
      <el-button type="success" plain @click="showAddUsers()">添加用户</el-button>
    </el-row>
    <!-- 表格 -->
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="id" label="#" width="100"></el-table-column>
      <el-table-column prop="username" label="姓名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="140"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="140"></el-table-column>

      <el-table-column label="创建日期" width="180">
        <template slot-scope="scope">{{scope.row.create_time | fmtdate }}</template>
      </el-table-column>

      <el-table-column label="用户状态" width="140">
        <template slot-scope="scope">
          <el-switch
            @change="currentState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
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
            @click="delUser(scope.row.id)"
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            plain
          ></el-button>
          <el-button
            @click="showRole(scope.row)"
            type="success"
            icon="el-icon-check"
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
      :page-sizes="[1, 3, 1, 4]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formdata.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUsers()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input disabled v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUsers()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 对勾 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="formdata" label-width="80px">
        <el-form-item label="用户名">{{formdata.username}}</el-form-item>

        <!-- 下拉 -->
        <el-form-item label="角色">
          <el-select v-model="selectVal" placeholder="请选择角色">
            <el-option disabled label="请选择" :value="-1"></el-option>
            <!-- label控制下拉框的文本 -->
            <el-option v-for= "(item,i) in roles" :key="i" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="changeRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
  <!-- query查询参数可以为空 -->
  <!-- pagenum当前页码不能为空 -->
  <!-- pagesize每页显示条数不能为空 -->
</template>

<script>
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 4,
      list: [],
      total: -1,
      dialogFormVisible: false,
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,  
      formdata: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      roles:[],
      selectVal:-1,
      userId:-1
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    // 点击确定时分配用户角色 users/:id/role
   async changeRole (){
      const res = await this.$http.put(`users/${this.userId}/role`,{
        rid:this.selectVal
      })
      const {meta:{status,msg}} = res.data
      if(status === 200) {
        this.$message.success(msg)
      }
      this.dialogFormVisibleRole = false
    },
    //  点击对勾时弹出对话框
    async showRole(user){
      this.dialogFormVisibleRole = true
      this.formdata = user
      const res = await this.$http.get(`roles`)
      this.roles = res.data.data
      const res2 = await this.$http.get(`users/${user.id}`)
      this.selectVal = res2.data.data.rid
      //显示当前用户角色
      this.userId = user.id
    },
    // 状态改变时 users/:uId/state/:type
    async currentState(user) {
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      const {
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
      }
    },
    // 点击对话框确定提交用户修改
    async editUsers() {
      const res = await this.$http.put(`users/${this.formdata.id}`,this.formdata);
      // console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        // 编辑成功
        this.$message.success(msg);
        this.dialogFormVisibleEdit = false;
      }
    },

    // 显示编辑用户对话框
    async showEditUser(user) {
      this.dialogFormVisibleEdit = true;
      this.formdata = user;
    },
    // 删除用户
    async delUser(ID) {
      if (confirm("确定要删除吗")) {
        const res = await this.$http.delete(`users/${ID}`);
        const {
          meta: { msg, status }
        } = res.data;
        // console.log(res);
        // console.log(msg);
        // console.log(status);
        // this.pagenum = 1
        // this.getTableData();
        this.getTableData();
      }
    },
    // 添加用户
    async addUsers() {
      const res = await this.$http.post(`users`, this.formdata);
      //   console.log(res)
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        //   添加成功
        this.$message.success(msg);
        console.log(msg);
        //   提示用户 重新渲染数据
        this.getTableData();
        // 让值清空
        this.formdata = {};
      }
      this.dialogFormVisibleAdd = false;
    },
    //   点击添加用户弹出框
    showAddUsers() {
      this.formdata = {}
      this.dialogFormVisibleAdd = true;
    },
    // 清空时 获取所有用户
    getAllUsers() {
      this.getTableData();
    },
    // 点击搜索发送请求查询用户
    searchUsers() {
      this.pagenum = 1;
      this.getTableData();
    },

    // 条数发生变化事件
    handleSizeChange(val) {
      this.pagenum = 1;
      this.pagesize = val;
      this.getTableData();
    },

    //   页数发生变化
    handleCurrentChange(val) {
      // this.pagesize = 1;
      this.pagenum = val;
      this.getTableData();
    },
    async getTableData() {
      //   除了登录页都需要授权
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      //   console.log(res)
      const {
        data,
        meta: { status }
      } = res.data;
      if (status === 200) {
        // 请求数据成功

        this.list = data.users;
        this.total = data.total;
        // console.log(this.total)
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.rowInput {
  margin-top: 30px;
}
.input-with-select {
  width: 400px;
}
.pageStyle {
  margin-top: 20px;
}
</style>
