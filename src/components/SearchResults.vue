<template>
    <div id="searchResults">
        <transition name="fade">
            <div v-if="!looked" class="loading">
                <p>Loading..</p>
            </div>
        </transition>
        <div v-if="searchRes && looked">
            <div class="resultsSection">
                <p class="resultCount"><span><b><i> We found {searchRes.numResults} results </i></b></span></p>

                <div class="commResults" v-if="commFound && looked">
                    <h1>Communities</h1>
                    <!-- <el-table class="commTable"
                        :commData="commTable"
                        style="width: 95%">
                        <el-table-column
                            prop="community"
                            label="Community">
                        </el-table-column>
                        <el-table-column
                            prop="date"
                            label="Created on">
                        </el-table-column>
                    </el-table> -->
                    <el-table
                        :data="commTable"
                        style="width: 95%">
                        <el-table-column
                            prop="community"
                            label="Community">
                        </el-table-column>
                        <el-table-column
                           prop="name"
                            label="Name">
                        </el-table-column>
                    </el-table>
                </div>
               
                <div class="resourceResults" v-if="resFound && looked">
                    <h1>Resources</h1>
                     <el-table
                        :data="resourceTable"
                        style="width: 95%">
                        <el-table-column
                            prop="resource"
                            label="Resource">
                        </el-table-column>
                        <el-table-column
                           prop="name"
                            label="Author">
                        </el-table-column>
                        <el-table-column
                           prop="date"
                           label="Created on">
                        </el-table-column>
                    </el-table>
                </div>
                
            </div>
        </div>
        <div class="noResults" v-if="!searchRes && looked">
            <h1 align="center">Search results not found. Try another search.</h1>
        </div>


    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import moment from 'moment'
    import { VueperSlides, VueperSlide } from 'vueperslides'
    import 'vueperslides/dist/vueperslides.css'
    const fb = require('../firebaseConfig.js');
    export default {
        beforeCreate() {
            // load table data
            // this.resourceTable.push({
            //         resource: "res 4",
            //         name: "res name 4",
            //         date: Date()
            //     });
            // this.$store.commit('setCommunityProfile', false);
            // this.$store.commit('setCurrentCommunity', this.$route.params.id);
            // this.$store.dispatch('fetchCommunityProfile');
        },
        beforeUpdate() {
            this.looked = true;
            this.commFound = true;
            this.resFound = true;
        },
        data() {
            return{
                resourceTable: [{
                    resource: "res 1",
                    name: "res name 1",
                    date: Date()
                },
                {
                    resource: "res 2",
                    name: "res name 2",
                    date: Date()
                },{
                    resource: "res 3",
                    name: "res name 3",
                    date: Date()
                }],
                commTable: [{
                    community: "Seattle" ,
                    date: Date(),
                }],
                looked: true,
                searchRes: true,
                commFound: true,
                resFound: true,
            }
        }
        }

</script>