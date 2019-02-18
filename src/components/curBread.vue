<template>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{lve1}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{lve2}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    name:'CurBread',
    props:['lve1','lve2']
}
</script>

<style>

</style>
