<template>
  <el-card>
    <CurBread lve1="商品列表" lve2="商品管理"></CurBread>
    <!-- alert提示框 -->
    <el-alert title="添加商品信息" type="info" center show-icon class="alert"></el-alert>
    <!-- 步骤条 -->
    <el-steps :active="this.active*1" align-center>
      <el-step title="基本商品"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="上传图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- tabs切换 -->
    <el-form label-position="top" :model="form" class="form">
      {{this.selectedOptions}}
      <el-tabs @tab-click="changeTag()" v-model="active" tab-position="left">
        <el-tab-pane label="基本商品" name="1">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <!-- 商品分类 -->
          <el-form-item label="商品分类">
            <el-cascader
              :props="defaultProp"
              expand-trigger="hover"
              :options="options"
              v-model="selectedOptions"
              @change="handleChange"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>

        <!-- 商品参数 -->
        <el-tab-pane label="商品参数" name="2">
          <el-form-item :label="item.attr_name" v-for="(item,i) in attrDt" :key="item.attr_id">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox :label="item1" border v-for="(item1,i) in item.attr_vals" :key="i"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>

        <!-- 商品属性 -->
        <el-tab-pane label="商品属性" name="3">
            <el-form-item :label="item.attr_name" v-for="(item,i) in attrJt" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <!-- 商品图片 -->
        <el-tab-pane label="商品图片" name="4">
            <el-upload
            class="upload-demo"
            action="http://127.0.0.1:8888/api/private/v1/upload"
            :headers="headers"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>            
            </el-upload>
        </el-tab-pane>

        <!-- 商品内容 -->
        <el-tab-pane label="商品内容" name="5">
            <el-form-item>
                <el-button @click="addGoods()">添加商品</el-button>
                <quillEditor v-model="form.goods_introduce" class="mrr"> </quillEditor>

            </el-form-item>

        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
 
import { quillEditor } from 'vue-quill-editor'
export default {
    components:{
        quillEditor
    },
  data() {
    return {
      active: "1",
      form: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: [],
        attrs: []
      },
      attrVs: [],
      attrDt: [],
      attrJt: [],
      defaultProp: {
        label: "cat_name",
        value: "cat_id"
      },
      //   动态参数选中
      checkLits:[],
      //    数据源
      options: [],
      //    分类参数
      selectedOptions: [1, 3, 6],
      headers:{
          Authorization:localStorage.getItem("token")
      }
    };
  },
  created() {
    this.getattrData();
  },
  methods: {
//       {
//   "goods_name":"test_goods_name2",
//   "goods_price":20,
//   "goods_number":30,
//   "goods_weight":40,
//   "goods_introduce":"abc",
//   "pics":[
//     {"pic":"/tmp_uploads/30f08d52c551ecb447277eae232304b8"}
//     ],
//   "attrs":[
//     {
//       "attr_id":15,
//       "attr_value":"ddd"
//     },
//     {
//       "attr_id":15,
//       "attr_value":"eee"
//     }
//     ]
// }

    // 添加商品
   async addGoods() {
        // 分类
       this.form.goods_cat = this.selectedOptions.join(',')
        // 参数
       const arr1 = this.attrDt.map(item=>{
           return {attr_id:item.attr_id,attr_value:item.attr_vals}
       }) 
       const arr2 = this.attrJt.map(item=>{
           return {attr_id:item.attr_id,attr_value:item.attr_vals}
       }) 
       this.form.attrs = [...arr1,...arr2]


       const res = await this.$http.post(`goods`,this.form)
        const {
            data,
            meta: { msg,status }
          } = res.data;
          if(status === 201) {
              this.$message.success(msg)
              this.$router.push({
                  name:'goods'
              })
          }else{
              this.$message.error(msg)
          }
       
    },  
    // 设置图片 pics [{pic}]  文件上传成功时自动触发的钩子   
    handleSuccess(response, file, fileList){
        // console.log(response)
        // response.data.tmp_path
        this.form.pics.push({pic:response.data.tmp_path})
    },
    // 删除文件时自动触发的钩子
    handleRemove(file, fileList) {
        // console.log(file)
        // file.response.data.tmp_path
        // 筛选
        const Index =this.form.pics.findIndex(item=>{
            return item.pic === file.response.data.tmp_path
        })
        this.form.pics.split(Index,1)
    },
    

    // tab发生变化后的事件 categories/:id/attributes
    async changeTag() {
      //   动态参数
      if (this.active === "2" || this.active === "3") {
        if (this.selectedOptions.length !== 3) {
            if(this.active === "3"){
                this.attrJt = []
            }else{
                this.attrDt = []
            }
          this.$message.error("请先选择分类！");
          return;
        }
        // 静态参数
        if(this.active === "3") {
            const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`)
             const {
            data,
            meta: { status }
          } = res.data;
          if (status === 200) {
            this.attrJt = data;
            // console.log(data);
            // this.attrDt.forEach(item => {
            //   item.attr_vals = item.attr_vals.split(",");
            // });
          }
        }


        // 动态参数
        if (this.active === "2") {
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
              if(item.attr_vals.length === 0) {
                  item.attr_vals = []
              }else{
                 item.attr_vals = item.attr_vals.split(",");
              }    
            });
          }
        }
      }
    },
    // 当级联选择器绑定值变化时触发的事件
    handleChange() {},
    // 获取分类数据
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
.ql-snow{
    height: 200px
}
.mrr {
    margin-top: 10px;
}
.form {
  overflow: auto;
}
.alert {
  margin: 15px 0;
}
</style>
