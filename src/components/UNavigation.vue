<template>
    <div>
        <el-menu class="el-menu"
                 mode="horizontal"
                 background-color="#5A61A6"
                 text-color="#fff"
                 :router="true"
                 active-text-color="#ffd04b">
            <el-menu-item style="font-size: 30px">HomingHaven</el-menu-item>
            <el-submenu index="4" style="float: right; font-size: 50px; color: #FFFFFF">
                <template slot="title"><i class="el-icon-menu"  style="color: #FFFFFF"></i></template>
                <el-menu-item index="4-1" :route="{name:'Login'}" style="color: #FFFFFF" ><i class="el-icon-user"  style="color: #FFFFFF"></i> Sign In</el-menu-item>
                <el-menu-item index="4-2" :route="{name:'Registration'}" style="color: #FFFFFF" ><i class="el-icon-discover"  style="color: #FFFFFF"></i> Registration</el-menu-item>
            </el-submenu>
            <el-menu-item index="1" style="float: right; color: #FFFFFF" :route="{name:'Registration'}" class="hide-nav">Registration</el-menu-item>
            <el-menu-item index="2" style="float: right; color: #FFFFFF" :route="{name:'Login'}" class="hide-nav">Sign In</el-menu-item>
        </el-menu>
    </div>
</template>

<script>
    export default {
        methods: {
            login() {
                this.$router.push('/login')
            },
            register() {
                this.$router.push('/registration')
            }
        }
    }
</script>

<style lang=scss" scoped>

    .el-menu--horizontal .el-submenu > .el-menu {
        left: initial !important;
        right: 0;
    }
</style>
