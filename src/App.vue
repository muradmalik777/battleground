<template>
  <v-app class="app">
    <topbar></topbar>
    <div class="content">
        <router-view></router-view>
    </div>
    <loader v-if="this.$store.state.loading"></loader>
  </v-app>
</template>

<script>
import TopBar from '@/components/TopBar';
import Loader from '@/components/Loader';


export default {
  name: 'App',
  components: {
    'topbar': TopBar,
    'loader': Loader,
  },
  data () {
    return {
      
    }
  }
}
</script>
<style lang="scss" scoped>
.app{
  background-image: url('assets/imgs/back.png');
  background-size: cover;
  padding-bottom: 100px;
  background-color: #1F2034;
}
.content{}
</style>

