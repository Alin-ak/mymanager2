<template>
  <el-card class="box">
    <curBread lve1="商品管理" lve2="分类参数"></curBread>
    <el-alert title="注意，只允许为第三级分类参数" type="warning" show-icon class="mr" :closable="false"></el-alert>
    <!-- 级联选择器 -->
    <el-form label-position="left" :model="form" class="form" label="请添加分类">
      <el-form-item label="请选择商品分类">
        <el-cascader
          :show-all-levels="false"
          :props="defaultProp"
          expand-trigger="hover"
          :options="options"
          v-model="selectedOptions"
          @change="handleChange"
          clearable
        ></el-cascader>
      </el-form-item>
      <!-- tabs -->
      <el-tabs v-model="activeName" @tab-click="handleClick()" >
        <el-tab-pane label="动态参数" name="1">
          <el-button disabled>设置参数</el-button>
          <!-- 数据表格 -->
          <el-table :data="attrDt" style="width: 100%" height="480">
            <el-table-column type="expand" width="100">
              <template slot-scope="scope">
                <el-tag
                  :key="i"
                  v-for="(item,i) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(scope.row,item)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="100"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称" width="400"></el-table-column>

            <el-table-column label="操作" min-width="180">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
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

          <!-- 静态参数 -->
        </el-tab-pane> 

        <el-tab-pane label="静态参数" name="2" >
      
        <el-table :data="attrJt" style="width: 100%" height="480">
            
            <el-table-column type="index" label="#" width="100"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称" width="400"></el-table-column>
             <el-table-column prop="attr_vals" label="属性属性值" width="400"></el-table-column>

            <el-table-column label="操作" min-width="180">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
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

        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      selectedOptions: [],
      activeName: "1",
      //   级联数据
      options: [],
      attrVs: [],
      attrDt: [],
      attrJt: [],
      defaultProp: {
        label: "cat_name",
        value: "cat_id"
      },
      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    this.getattrData();
  },
  methods: {
    // categories/:id/attributes/:attrId 删除参数
    async handleClose(obj, item) {
      obj.attr_vals.splice(obj.attr_vals.indexOf(item), 1);
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${obj.attr_id}`,
        {
          attr_name: obj.attr_name,
          attr_sel: obj.attr_sel,
          attr_vals: obj.attr_vals.join(",")
        }
      );
      const {
        meta: { status }
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
      }
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 添加参数
    async handleInputConfirm(obj) {
      const inputValue = this.inputValue;
      if (inputValue) {
        obj.attr_vals.push(inputValue);
        const res = await this.$http.put(
          `categories/${this.selectedOptions[2]}/attributes/${obj.attr_id}`,
          {
            attr_name: obj.attr_name,
            attr_sel: obj.attr_sel,
            attr_vals: obj.attr_vals.join(",")
          }
        );
        const {
          meta: { status,msg }
        } = res.data;
        if (status === 200) {
          this.$message.success(msg);
          this.inputVisible = false;
          this.inputValue = "";
        }
      }
    },

  async handleClick() {
        if (this.selectedOptions.length !== 3) {
        // 获取动态参数
         this.$message.warning('请先选择三级分类')
         if(this.activeName === "1"){
             this.attrDt = []
         }
         if(this.activeName === "2"){
              this.attrJt = []
         }
         return 
        }
        // 动态参数
        if (this.activeName === "1") {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=many`
          );
          // console.log(res);
          const {
            data,
            meta: { status }
          } = res.data;
          if (status === 200) {
            this.attrDt = data;
            console.log(data);

            this.attrDt.forEach(item => {
              if (item.attr_vals.length === 0) {
                item.attr_vals = [];
              } else {
                item.attr_vals = item.attr_vals.split(",");
              }
            });
          }
        }
        // 静态参数
        if(this.activeName === "2") {
            const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          const {
            data,
            meta: { status }
          } = res.data;
          if (status === 200) {
            this.attrJt = data;
            console.log(this.arrJt);
            //   console.log(data);
            this.attrJt.forEach(item => {
              // 如果后台返回的是个很多空格的字符，那么 trim去掉前后空格
              if (item.attr_vals.length === 0) {
                item.attr_vals.trim = [];
              } else {
                item.attr_vals = item.attr_vals.trim();
              }
            });
          }
        }
  },

    // 当点击tab时
    async handleChange () {
      this.handleClick()
      
    },
    //   分类数据
    async getattrData() {
      const res = await this.$http.get(`categories/?type=3`);
      const {
        data,
        meta: { status }
      } = res.data;
      if (status === 200) {
        this.options = data;
        //    console.log(data)
      }
    }
  }
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.box {
  height: 100%;
}
.mr {
  margin: 15px 0;
}
</style>
