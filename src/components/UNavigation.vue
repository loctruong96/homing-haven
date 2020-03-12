<template>
    <div>
        <el-menu class="el-menu"
                 mode="horizontal"
                 background-color="#5A61A6"
                 text-color="#fff"
                 :router="true"
                 active-text-color="#ffd04b">
            <el-menu-item  index="1" style="font-size: 2vw" :route="{name:'UDashboard'}" class="hide-icon">HomingHaven</el-menu-item>
            <el-menu-item style="width: 50vw; min-width: 200px" class="flex-input">
                <el-input @keyup.enter.native="search(search_term)" placeholder="Search for communities or resources..." v-model="search_term">
                    <el-button slot="append" icon="el-icon-search" @click="search(search_term)"></el-button>
                </el-input>
            </el-menu-item>
            <el-submenu index="4" style="float: right; font-size: 50px; color: #FFFFFF">
                <template slot="title"><i class="el-icon-menu"  style="color: #FFFFFF"></i></template>
                <el-menu-item  index="4-0" style="color: #FFFFFF" :route="{name:'UDashboard'}"><i class="el-icon-s-home"  style="color: #FFFFFF"></i>Home</el-menu-item>
                <el-menu-item index="4-1" :route="{name:'Login'}" style="color: #FFFFFF" ><i class="el-icon-unlock"  style="color: #FFFFFF"></i>Sign In</el-menu-item>
                <el-menu-item index="4-2" :route="{name:'Registration'}" style="color: #FFFFFF" ><i class="el-icon-discover"  style="color: #FFFFFF"></i>Registration</el-menu-item>
            </el-submenu>
            <el-menu-item index="2" style="float: right; color: #FFFFFF" :route="{name:'Registration'}" class="hide-nav"><i class="el-icon-discover"  style="color: #FFFFFF"></i>Registration</el-menu-item>
            <el-menu-item index="3" style="float: right; color: #FFFFFF" :route="{name:'Login'}" class="hide-nav"><i class="el-icon-unlock"  style="color: #FFFFFF"></i>Sign In</el-menu-item>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                search_term:''
            }
        },
        methods: {
            login() {
                this.$router.push('/login')
            },
            register() {
                this.$router.push('/registration')
            },
            search(search_term){
                this.$store.commit('setCommTable', null);
                this.$store.commit('setResourceTable', null);
                this.$store.commit('setLooking', true);
                this.$store.commit('setCurrentSearch', this.search_term);
                this.$store.dispatch('fetchSearchResults');
                this.$router.push(`/search/${search_term}`)
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
