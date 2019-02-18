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
      router
      unique-opened
      default-active="2"
      class="el-menu-vertical-demo">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>用户管理</span>
        </template>
          <el-menu-item index="users">
             <i class="el-icon-menu"></i>
            <span>用户列表</span>
            </el-menu-item>
      </el-submenu>
       <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>权限管理</span>
        </template>
          <el-menu-item index="roles">
             <i class="el-icon-menu"></i>
             <span>角色列表</span>
            </el-menu-item>

             <el-menu-item index="rights">
             <i class="el-icon-menu"></i>
             <span>权限列表</span>
            </el-menu-item>
      </el-submenu>
       <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>商品管理</span>
        </template>
          <el-menu-item index="1-1">
             <i class="el-icon-menu"></i>
              <span>商品列表</span>
            </el-menu-item>

            <el-menu-item index="1-1">
             <i class="el-icon-menu"></i>
              <span>分类参数</span>
            </el-menu-item>

            <el-menu-item index="1-1">
             <i class="el-icon-menu"></i>
              <span>商品分类</span>
            </el-menu-item>
      </el-submenu>
       <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>订单管理</span>
        </template>
          <el-menu-item index="1-1">
             <i class="el-icon-menu"></i>
            <span>订单列表</span>
            </el-menu-item>
      </el-submenu>

       <el-submenu index="5">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>数据统一</span>
        </template>
          <el-menu-item index="1-1">
             <i class="el-icon-menu"></i>
            <span>数据报表</span>
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
  beforeMount () {
    if (!localStorage.getItem('token')) {
      // 说明没有token 改标识
      this.$router.push({
        name: 'login'
      })
      this.$message.warning('请先登录')
    }
  },
  methods: {
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
