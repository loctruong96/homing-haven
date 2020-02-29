<template>
    <div>
        <el-menu class="el-menu"
                 mode="horizontal"
                 background-color="#5A61A6"
                 text-color="#fff"
                 @select="handleSelect"
                 :router="true"
                 active-text-color="#ffd04b">
            <el-menu-item  index="1" style="font-size: 2vw" :route="{name:'UDashboard'}" class="hide-icon">HomingHaven</el-menu-item>
            <el-menu-item style="width: 48vw; min-width: 200px" class="flex-input">
                <el-input placeholder="Search for communities or resources..." v-model="search">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </el-menu-item>
            <el-submenu index="4" style="float: right; font-size: 50px; color: #FFFFFF">
                <template slot="title"><i class="el-icon-menu"  style="color: #FFFFFF"></i></template>
                <el-menu-item index="4-1" style="color: #FFFFFF" :route="{name:'UserInfo'}" ><i class="el-icon-user-solid" style="color: #FFFFFF"></i>{{ userProfile.name }}</el-menu-item>
                <el-menu-item index="4-2" :route="{name:'NewComm'}" style="color: #FFFFFF" ><i class="el-icon-folder-add"  style="color: #FFFFFF"></i>New Community</el-menu-item>
                <el-menu-item index="4-3" style="color: #FFFFFF" ><i class="el-icon-add-location" style="color: #FFFFFF"></i>New Resource</el-menu-item>
                <el-menu-item index="4-4" style="color: #FFFFFF"><i class="el-icon-switch-button" style="color: #FFFFFF"></i>Logout</el-menu-item>
            </el-submenu>
            <el-menu-item index="2" style="float: right; color: #FFFFFF" :route="{name:'NewComm'}" class="hide-nav-signed"><i class="el-icon-folder-add"  style="color: #FFFFFF"></i>New Community</el-menu-item>
            <el-menu-item index="3" style="float: right; color: #FFFFFF" class="hide-nav-signed"><i class="el-icon-add-location" style="color: #FFFFFF"></i>New Resource</el-menu-item>
        </el-menu>
    </div>
</template>

<script>
    const fb = require('../firebaseConfig.js');
    import { mapState } from 'vuex'

    export default {
        data() {
            return {
                views: ["Popular Communities"],
                selectedView: "Popular Communities",
                search: ''
            }
        },
        computed: {
            ...mapState(['userProfile'])
        },
        methods: {
            handleSelect(key, keyPath) {
                // console.log(key, keyPath);
                if(key === '4-4'){
                    // logout
                    fb.auth.signOut().then(() => {
                        this.$store.dispatch('clearData');
                        this.$router.push({ name: 'Login' })
                    }).catch(err => {
                        console.log(err)
                    })
                }
            }
        }
    }
</script>

<style lang=scss" scoped>

    .el-menu--horizontal .el-submenu > .el-menu {
        left: initial !important;
        right: 0;
    }
    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }

</style>
