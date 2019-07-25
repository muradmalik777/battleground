<template>
    <v-container class="topbar spacing" fluid>
        <v-layout justify-center row wrap class="live-drops" pb-2>
            <v-flex xs12>
                <h2 class="m-b">LIVE DROPS</h2>
                <carousel :autoplay="true" :loop="true" :rewind="false" :dots="false" :nav="false" :autoWidth="true">
                    <div v-for="image in 25" :key="image" class="drop-box">
                        <v-img :src="dropPicture(image)" class="drop-image m-t-3"></v-img>
                        <h6 class="t-c">Tec-g Red Quartz</h6>
                    </div>
                </carousel>
            </v-flex>
        </v-layout>
        <v-layout justify-center row wrap mt-2 class="navbar">
            <v-flex xs2 class="text-xs-left">
                <router-link to="/"><v-img contain :src="require('@/assets/imgs/icon.svg')" class="nav-logo pointer"></v-img></router-link>
            </v-flex>
            <v-flex xs8 class="text-xs-center">
                <v-btn flat class="nav-link" to="/">
                    cases
                </v-btn>

                <v-btn flat class="nav-link" to="/about">
                    rewards
                </v-btn>
                <v-btn flat class="nav-link" to="/faq">
                    support
                </v-btn>
                <v-btn flat class="nav-link" to="/upgrades">
                    upgrades
                </v-btn>
            </v-flex>
            <v-flex xs2 class="text-xs-right">
                <v-btn flat @click.stop="drawer = !drawer" class="nav-link m-0">{{$store.state.userData.user_name}}</v-btn>          
                <v-navigation-drawer width="250" v-model="drawer" absolute right temporary>
                    <h3 class="t-c m-t-3 m-b">{{$store.state.userData.user_name}}</h3>
                    <p class="c-green-bright t-c amount m-b-2">${{parseFloat($store.state.userData.balance).toFixed(2)}}</p>
                    <v-list class="dropdown">
                        <v-list-tile to="/profile" class="user-menu pointer">
                            <v-list-tile-title>Profile</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="openDialog" class="user-menu pointer c-purple-bright">
                            <v-list-tile-title>Add Funds</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile to="/faq" class="user-menu pointer c-purple-bright">
                            <v-list-tile-title>Help</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="signout()" class="user-menu pointer">
                            <v-list-tile-title>Logout</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-navigation-drawer>
                <deposits :dialog="showDepositDialog" @close="closeDialog" v-if="$store.state.userData"></deposits>
                <div v-else>
                    <v-btn flat outline color="#fff" class="login-btn" v-if="$route.path.includes('/register') || !$route.path.includes('/login')" :to="'/login'" >login</v-btn>
                    <v-btn flat outline color="#fff" class="login-btn" v-if="$route.path.includes('/login')" :to="'/register'" >signup</v-btn>
                </div>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import Api from '../services/Api.js';
import DepositDialog from '@/components/DepositDialog'
import carousel from 'vue-owl-carousel'


export default {
    name: 'navbar',
    components: {
        'deposits': DepositDialog,
        carousel,
    },
    data: function(){
        return{
            drawer: false,
            showDepositDialog: false,
            selectedImage: 1,
        }
    },
    mounted: function () {
        this.getLoggedInUserData()
    },
    methods: {
        getLoggedInUserData: function(){
            var urlParams = new URLSearchParams(window.location.search);
            if(urlParams.has('openid.claimed_id')){
                this.loading = true
                let id = urlParams.get('openid.claimed_id').split("/")
                id = id[id.length-1]
                let params = { id: id}
                let userObject = new Api()
                userObject.raw('post', '/steam', params).then(response =>{
                    this.$store.commit('addUser', response)
                }).catch(() => {

                })
            }
        },
        signout: function(){
            this.user = null
            this.logout()
        },
        openDialog: function(){
            this.showDepositDialog = true
        },
        closeDialog: function(){
            this.showDepositDialog = false
        },
        dropPicture: function(image){
            return require("@/assets/imgs/drop-image.png")
        },
    },
}
</script>
<style lang="scss">
@import "../assets/scss/variables.scss";

.topbar{
    max-width: 100%;
    max-height: 400px;
    margin: 0 auto;

    .drop-box{
        width: 210px;
        height: 170px;
        float: left;
        cursor: pointer;
        background-image: url('../assets/imgs/drops-back.png');
        background-size: cover;
        margin-right: 1rem;
        transition: background-color 0.35s;

        .drop-image{
            width: 85px;
            height: 85px;
            display: block;
            margin: .85rem auto;
        }
    }

    .nav-logo{
        width: 60px;
        height: auto;
        margin: .8rem 0 0 0;
    }
    .nav-link{
        color: white;
        text-transform: uppercase;
        font-size: 16px;
        height: 50px;
        &:hover{
            color: $red;
            &::before{
                display: none;
            }
        }
    }
    .login-btn{
        width: 145px;
        height: 53px;
        margin: 0;
        &:hover{
            border-color: $red;
            &::before{
                display: none;
            }
        }
    }
    .nav-link.v-btn--active{
        color: $red;
        font-size: 16px;
        border-bottom: 2px solid #D1415570;
        &::before{
            display: none;
        }
    }
    .v-navigation-drawer{
        background: $dark2 !important;
    }
    .user-menu{
        &:hover{
            background: $red;
        }
        div{
            text-align: center !important;
            font-size: 16px !important;
            font-weight: 600;
        }
    }
    .v-list__tile--active{
        color: $red !important;
        &:hover{
            color: $white !important;
        }
    }
    .verified{
        font-size: 12px;
        color: #bbbbbb !important;
        margin-left: .5rem;
    }
}
</style>
