<template>
    <div id="searchResults">
        <transition name="fade">
            <div v-if="!looked || looking" class="loading">
                <p>Loading..</p>
            </div>
        </transition>
        <div v-if="(commTable || resourceTable) && looked && !looking">
            <div class="resultsSection">
                <p class="resultCount"><span><b><i> Results for "{{$route.params.id}}"  </i></b></span></p>

                <div class="commResults" v-if="commTable && looked">
                    <h1>Communities</h1>
                    <el-table class="ctable_format"
                        :data="commTable"
                        style="width: 95%">
                        <el-table-column
                            width=90>
                            <template slot-scope="scope">
                                <el-button class="viewButton"
                                           size="mini"
                                           @click="viewCommunity(scope.$index, scope.row)"
                                           round>
                                    View
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="community"
                            label="Community Link">
                        </el-table-column>
                        <el-table-column
                           prop="name"
                            label="Name">
                        </el-table-column>
                    </el-table>
                </div>

                <div class="resourceResults" v-if="resourceTable && looked && !looking">
                    <h1>Resources</h1>
                     <el-table class="rtable_format"
                        :data="resourceTable"
                        style="width: 95%">
                        <el-table-column
                            width=90>
                            <template slot-scope="scope">
                            <el-button class="viewButton"
                                size="mini"
                                @click="viewResource(scope.$index, scope.row)"
                                round>
                                View
                            </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="resource"
                            label="Resource Link">
                        </el-table-column>
                        <el-table-column
                           prop="name"
                            label="Name">
                        </el-table-column>
                    </el-table>
                </div>

            </div>
        </div>
        <div class="noResults" v-if="notFoundCom && notFoundRes && looked && !looking">
            <h1 align="center">Search results not found. Try another search.</h1>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import 'vueperslides/dist/vueperslides.css'
    const fb = require('../firebaseConfig.js');
    export default {
        beforeCreate() {
            this.looked = false;
            this.$store.commit('setCurrentSearch', this.$route.params.id);
            this.$store.dispatch('fetchSearchResults');
        },
        beforeUpdate() {
            this.looked = true;
        },
        data() {
            return{
                looked: false,
            }
        },
        computed: {
            ...mapState(['currentSearch', 'resourceTable', 'commTable', 'notFoundCom', 'notFoundRes', 'looking']),
        },
        methods: {
            viewCommunity(index, row){
                this.$router.push(`/community/${row.community}`)
            },
            viewResource(index, row){
                this.$router.push(`/resource/${row.resource}`)
            }
        }
    }

</script>
