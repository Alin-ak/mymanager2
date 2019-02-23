<template>
  <el-container class="container">
    <el-header class="homeHeader">
      <el-row>
        <el-col :span="4">
          <img src="@/assets/logo.png" alt="logo图片">
        </el-col>
        <el-col :span="19" class="middle">
          <h2>电商后台管理</h2>
        </el-col>
        <el-col :span="1">
          <a href="#" class="exit"
          @click.prevent="exitHome()">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <!-- 导航容器 -->
    <el-container>
      <el-aside width="200px" class="homeAside">
           <el-menu
      @select="fn"     
      router
      unique-opened
      :default-active="$route.name"
      class="el-menu-vertical-demo">
      
      <el-submenu :index="item.order+''" v-for="(item,i) in list" :key="item.id">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{item.authName}}</span>
        </template>
          <el-menu-item :index="item1.path" v-for="(item1,i) in item.children" :key="item1.id">
             <i class="el-icon-menu"></i>
            <span>{{item1.authName}}</span>
            </el-menu-item>
      </el-submenu>
       

    </el-menu>
      </el-aside>
      <el-main class="homeMain">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data(){
    return {
      list:[]
    }
  },
  beforeMount () {
    // if (!localStorage.getItem('token')) {
    //   // 说明没有token 改标识
    //   this.$router.push({
    //     name: 'login'
    //   })
    //   this.$message.warning('请先登录')
    // }
  },
  created(){
    this.getRigths()
  },
  methods: {
    fn(index,indexPath) {
      // console.log(indexPath)
    },
      // 根据用户权限显示对应导航内容
    async getRigths(){
        const res = await this.$http.get(`menus`)
        const {data,meta:{status}} = res.data
        this.list = data
        // console.log(data)
    },
    exitHome () {
      if(confirm('确定要退出吗?')) {
         localStorage.clear()
         this.$router.push({
         name: 'login'
      })
      }
     
    }
  }
}
</script>

<style>
.homeHeader {
  background-color:#b3c0d1 ;
}
.homeMain {
  background-color: #fff;
}
.container {
  height: 100%;
}
.middle{
    line-height: 59px;
    text-align: center;
    color: #fff;
}
.exit {
    text-decoration: none;
    line-height: 59px;
}
</style>
