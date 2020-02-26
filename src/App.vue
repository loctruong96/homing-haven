
<template>
  <div id="app">
    <Navigation v-if="currentUser"></Navigation>
    <UNavigation v-if="!currentUser"></UNavigation>
    <router-view>

    </router-view>

  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Navigation from './components/Navigation.vue'
  import UNavigation from './components/UNavigation.vue'
  export default {
    components: { Navigation, UNavigation },
    computed: {
      ...mapState(['currentUser'])
    }
  }
</script>
