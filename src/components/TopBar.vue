<template>
    <v-container class="topbar">
        <v-layout justify-center row wrap class="live-drops spacing m-0">
            <v-flex xs12>
                <carousel :autoplay="true" :loop="true" :rewind="false" :dots="false" :nav="false" :autoWidth="true">
                    <div v-for="image in 25" :key="image" class="drop-box">
                        <v-img :src="dropPicture(image)" class="drop-image m-t-2"></v-img>
                        <h6 class="t-c">Tec-g Red Quartz</h6>
                        <v-btn flat class="open-btn">Open $0.20</v-btn>
                    </div>
                </carousel>
            </v-flex>
        </v-layout>
        <v-layout justify-center row wrap class="navbar">
            <v-flex xs3 class="text-xs-left">
                <router-link to="/"><v-img contain :src="require('@/assets/imgs/icon.svg')" class="nav-logo pointer"></v-img></router-link>
            </v-flex>
            <v-flex xs6 class="text-xs-center">
                <v-btn flat class="nav-link" to="/">
                    cases
                </v-btn>

                <v-btn flat class="nav-link" to="/caseBrowser">
                    case browser
                </v-btn>
                <v-btn flat class="nav-link" to="/faq">
                    support
                </v-btn>
                <v-btn flat class="nav-link" to="/about">
                    about
                </v-btn>
                <v-btn flat class="nav-link" to="/upgrades">
                    upgrades
                </v-btn>
            </v-flex>
            <v-flex xs3 class="text-xs-right">
                <div v-if="$store.state.userData" class="menu-box">
                    <v-btn flat @click="openDialog" class="nav-link">Add Funds</v-btn>
                    <v-btn flat @click="drawer = !drawer" class="nav-link user-name">{{$store.state.userData.user_name}}</v-btn>
                    <deposits :dialog="showDepositDialog" @close="closeDialog"></deposits>
                    <div v-if="drawer" class="menu">
                        <v-list class="dropdown">
                            <v-list-tile class="user-menu pointer">
                                <v-list-tile-title class="c-green-bright pointer">${{parseFloat($store.state.userData.balance).toFixed(2)}}</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="openDialog" class="user-menu pointer">
                                <v-list-tile-title>Add Funds</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="drawer = false" to="/profile" class="user-menu pointer">
                                <v-list-tile-title>Profile</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="drawer = false" to="/faq" class="user-menu pointer c-purple-bright">
                                <v-list-tile-title>Help</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="drawer = false" to="/tos" class="user-menu pointer c-purple-bright">
                                <v-list-tile-title>Terms of Service</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile  @click="signout()" class="user-menu pointer">
                                <v-list-tile-title>Logout</v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </div>
                </div>
                <v-btn outline color="#fff" class="login-btn" :to="'/login'" v-else>login</v-btn>
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
            this.drawer = false
            this.logout()
        },
        openDialog: function(){
            this.showDepositDialog = true
            this.drawer = false
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
    max-height: 300px;
    margin: 0 auto;
    padding: 0;

    .drop-box{
        width: 180px;
        height: 135px;
        float: left;
        cursor: pointer;
        background-image: url('../assets/imgs/drops-back.png');
        background-size: cover;
        margin: 0;
        transition: background-color 0.35s;
        position: relative;
        padding: 0;

        &:hover{
            .drop-image{
                opacity: 0.4;
            }
            .open-btn{
                display: block;
            }
        }

        .drop-image{
            width: 65px;
            height: 65px;
            display: block;
            margin: .85rem auto;
        }
        .open-btn{
            height: 35px;
            color: $white !important;
            background-image: $gradient !important;
            border-radius: 50px;
            font-size: 12px;
            position: absolute;
            top: calc(55% - 40px);
            left: 16%;
            display: none;
        }
    }
    .navbar{
        background: $dark3;
        padding: 2rem 100px;
    }
    .nav-logo{
        width: 50px;
        height: auto;
        margin: 0;
        margin-top: .5rem;
    }
    .user-name{
        color: $red !important;
        text-transform: capitalize;
    }
    .nav-link{
        color: white;
        text-transform: uppercase;
        font-size: 16px;
        height: 50px;
        padding: 0;
        margin: .4rem 0 0 2rem;
        &:hover{
            color: $red;
            &::before{
                display: none;
            }
        }
    }
    .login-btn{
        width: 145px;
        height: 50px;
        margin: 0;
        font-size: 16px;
        background-image: $gradient !important;
        border-radius: 50px;
        border: none;
    }
    .login-btn.v-btn--active{
        border: 2px solid $red;
        background-image: none !important;
        &::before{
            display: none;
        }
    }

    .nav-link.v-btn--active{
        color: $red;
        font-size: 16px;
        border-bottom: 2px solid $red;
        &::before{
            display: none;
        }
    }
    .menu-box{
        position: relative;
        z-index: 100 !important;

        .menu{
            position: absolute;
            top: 100%;
            bottom: 0;
            width: 210px;
            background-color: $dark3;
            .dropdown{
                background-color: $dark3;
                padding: 0;
            }

            .user-menu{
                &:hover{
                    background-image: $gradient;
                }
                div{
                    text-align: left !important;
                    font-size: 16px !important;
                    font-weight: 600;
                }
            }
        }
    }
    .v-list__tile--active{
        background-image: $gradient !important;
        color: $white !important;
        &:hover{
            color: $white !important;
        }
    }
}
@media only screen and (min-width: 1366px) and (max-width: 1440px) {
    .topbar{
        .menu-box{
            .menu{
                left: 45%;
            }
        }
    }
    .nav-link{
        padding: 0;
        font-size: 14px;
        margin: 5px !important;
    }
}
@media only screen and (min-width: 1441px) and (max-width: 1920px) {
    .topbar{
        .menu-box{
            .menu{
                left: 60%;
            }
        }
    }
}
@media only screen and (min-width: 1921px) and (max-width: 2560px) {
    .topbar{
        .menu-box{
            .menu{
                left: 70%;
            }
        }
    }
}
</style>
