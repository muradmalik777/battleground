<template>
    <v-container class="topbar spacing">
        <v-layout justify-center row wrap class="live-drops" pt-3 pb-3>
            <v-flex xs12>
                <h2 class="m-b-2">LIVE DROPS</h2>
                <carousel :autoplay="true" :loop="true" :dots="false" :nav="false" :autoWidth="true">
                    <div v-for="image in 20" :key="image" class="drop-box">
                        <v-img :src="dropPicture(image)" class="drop-image m-t-3"></v-img>
                    </div>
                </carousel>
            </v-flex>
        </v-layout>
        <v-layout justify-center row wrap mt-4 mb-4 pb-3 class="navbar">
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
                <v-menu offset-y max-width="230" min-width="230" v-if="$store.state.userData">
                    <template v-slot:activator="{ on }">
                        <v-btn flat v-on="on" class="nav-link m-0">{{$store.state.userData.user_name}} <span class="verified">[Verified]</span><br></v-btn>
                    </template>
                    <v-list class="menu" dark>
                        <v-list-tile class="user-menu pointer c-purple-bright">
                            <v-list-tile-title><p class="c-green-bright amount">${{parseFloat($store.state.userData.balance).toFixed(2)}}</p></v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile to="/profile" class="user-menu pointer c-purple-bright">
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
                </v-menu>
                <deposits :dialog="showDepositDialog" @close="closeDialog" v-if="$store.state.userData"></deposits>
                <v-btn flat outline color="#fff" class="login-btn" :to="'/login'" v-else>Login</v-btn>
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
            drawer: true,
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
    height: 400px !important;

    .drop-box{
        width: 185px;
        height: 135px;
        float: left;
        background-color: $dark1;
        margin-right: 2rem;
        border: 1px solid #D1415580;

        &:hover{
            background-color: $dark3;
        }

        .drop-image{
            width: 102px;
            height: 102px;
            cursor: pointer;
            display: block;
            margin: 1rem auto;
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
        .menu-btn-icon{
            width: 22px;
            height: 25px;
        }
    }
    .login-btn{
        width: 145px;
        height: 53px;
        margin: 0;
    }
    .login-btn.v-btn--active{
        color: $red !important;
        font-size: 16px;
        border: 2px solid #D1415570;
        &::before{
            display: none;
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
    .user-menu{
        color: #333333 !important;
    }
    .verified{
        font-size: 12px;
        color: #bbbbbb !important;
        margin-left: .5rem;
    }
}
</style>
