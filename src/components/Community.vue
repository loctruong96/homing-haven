<template>
<<<<<<< HEAD
    <div id="community">

        <div class="commBanner">
            <h1 align="center">[Name] Community</h1>
        </div>

        <div class="navInterests">
            <a class="active" href="#home">Home</a>
            <a href="#food">Food Assistance</a>
            <a href="#health">Health Care</a>
            <a href="#education">Education</a>
            <a href="#legal">Legal Assistance</a>
        </div>

        <div class="communityGuidelines">
            <div class="description">
                <h1>Description</h1>
                <p>Lorem ipsum dolor sit amet, diam etiam aeterno sed an, his cu falli eleifend accusamus,
                    vim blandit disputationi te. Ei voluptatum dissentiunt mei. Qui ei vidit perpetua molestiae.
                    Id qui alia iudico blandit, per elaboraret reformidans definitiones ne. Tota mucius nostrud
                    id sed, solet dictas ocurreret mei ex, pri ut veritus mediocrem vituperatoribus</p>
=======
    <div id="community" >
        <transition name="fade">
            <div v-if="!looked" class="loading">
                <p>Loading..</p>
            </div>
        </transition>
        <div v-if="communityProfile">
            <div class="commBanner" v-if="communityProfile">
                <h1 align="center"><span>{{communityProfile.name}}</span></h1>
            </div>

            <div class="navInterests" v-if="communityProfile">
                <a class="active" href="#home" >Home</a>
                <a href="#news">News</a>
                <a href="#contact">Contact</a>
                <a href="#about">About</a>
>>>>>>> origin
            </div>

            <div class="communityGuidelines" v-if="communityProfile">
                <div class="description" v-if="communityProfile">
                    <h1>Description</h1>
                    <p><span>{{ communityProfile.description }}</span></p>
                </div>
                <div class="commDetails" v-if="communityProfile">
                    <div class="rules">
                        <h3>Community Rules</h3>
                        <p><span>{{ communityProfile.rules }}</span></p>
                    </div>
                    <div class="activity" v-if="communityProfile">
                        <h3>Community Activity</h3>
                        <p>[number] new posts today</p>
                        <p>[number] members</p>
                        <p><i>Created [number] years ago</i></p>
                    </div>
                </div>
            </div>

            <div class="resourceCategories" v-if="communityProfile">
                <div class="popCategories">
                    <h1>Popular Resource Categories</h1>
                </div>
                <vueper-slides
                        class="no-shadow"
                        :visible-slides="3"
                        slide-multiple
                        :gap="3"
                        :arrows="false"
                        :slide-ratio="1 / 8"
                        :dragging-distance="200"
                        :breakpoints="{ 800: { visibleSlides: 2, slideMultiple: 2 } }">
                    <!--              <div class="slide2">-->
                    <vueper-slide v-for="(slide, i) in slides"
                                  :key="i"
                                  :title="slide.title"
                                  :content="slide.content"
                                  :style="'background-color: ' + ['#C3C7E7', '#C3C7E7'][i % 2]" />
                    <!--              </div>-->
                </vueper-slides>

                <div class="recCategories">
                    <h1>Recommended Resource Categories</h1>
                </div>
                <vueper-slides
                        class="no-shadow"
                        :visible-slides="3"
                        slide-multiple
                        :arrows="false"
                        :gap="3"
                        :slide-ratio="1 / 8"
                        :dragging-distance="200"
                        :breakpoints="{ 800: { visibleSlides: 2, slideMultiple: 2 } }">
                    <!--              <div class="slide2">-->
                    <vueper-slide v-for="(slide, i) in slides_recc"
                                  :key="i"
                                  :title="slide.title"
                                  :content="slide.content"
                                  :style="'background-color: ' + ['#C3C7E7', '#C3C7E7'][i % 2]" />
                    <!--              </div>-->
                </vueper-slides>
            </div>
        </div>
        <div class="commBanner" v-if="!communityProfile && looked">
            <h1 align="center">Community Not Found</h1>
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
        this.looked = false;
        this.$store.commit('setCommunityProfile', false);
        this.$store.commit('setCurrentCommunity', this.$route.params.id);
        this.$store.dispatch('fetchCommunityProfile');
    },
    beforeUpdate() {
        this.looked = true;
    },
    computed: {
        ...mapState(['communityProfile'])
    },
    data(){
        return{
            post: {
                    content: ''
                },
                slides: [
                {
                  id: 'slide-0',
                  title: '<b style="font-size: 1.3em;color: ">Food Assistance</b>',
                  content: 'This is the Food Assistance intererst.'+
                   '<br><br><button @click="foodAssistance_card"  class="button">View</button>'
                },
                {
                  id: 'slide-1',
                  title: '<b style="font-size: 1.3em;color: ">Health Care</b>',
                  content: 'This is the Healthcare interest.'+
                   '<br><br><button @click="healthcare_card"  class="button">View</button>'
                },
                {
                  id: 'slide-2',
                  title: '<b style="font-size: 1.3em;color: ">Education</b>',
                  content: 'This is the Education Interest.'+
                   '<br><br><button @click="education_card"  class="button">View</button>'
                },
                 {
                  id: 'slide-3',
                  title: '<b style="font-size: 1.3em;color: ">Legal Assistance</b>',
                  content: 'This is the Legal Assistance.'+
                   '<br><br><button @click="legalAssistance_card"  class="button">View</button>'
                }
              ],
              slides_recc: [
                {
                  id: 'slide-0',
                  title: '<b style="font-size: 1.3em;color: ">Recommended Category 1</b>',
                  content: 'This is a description'+
                   '<br><br><button @click="recc1_card"  class="button">View</button>'

                },
                {
                  id: 'slide-1',
                  title: '<b style="font-size: 1.3em;color: ">Recommended Category 2</b>',
                  content: 'This is a description'+
                   '<br><br><button @click="recc2_card"  class="button">View</button>'
                },
                {
                  id: 'slide-2',
                  title: '<b style="font-size: 1.3em;color: ">Recommended Category 3</b>',
                  content: 'This is a description'+
                   '<br><br><button @click="recc3_card"  class="button">View</button>'
                },
                 {
                  id: 'slide-3',
                  title: '<b style="font-size: 1.3em;color: ">Recommended Category 4</b>',
                  content: 'This is a description'+
                   '<br><br><button @click="recc4_card"  class="button">View</button>'
                }
              ],
            looked: false,
        }
    },
    components: { VueperSlides, VueperSlide }

}
</script>
