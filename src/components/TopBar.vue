<template>
    <v-container class="topbar">
        <v-layout justify-center row wrap class="live-drops spacing">
            <v-flex xs12>
                <carousel :autoplay="true" :dots="false" :nav="false" :autoWidth="true">
                    <div v-for="image in 20" :key="image" class="drop-box">
                        <v-img :src="dropPicture(image)" class="drop-image m-t-2"></v-img>
                        <h6 class="t-c">Tec-g Red Quartz</h6>
                        <v-btn flat class="open-btn">Open $0.20</v-btn>
                    </div>
                </carousel>
            </v-flex>
        </v-layout>
        <v-layout justify-center row wrap class="navbar">
            <v-flex xs3 class="text-xs-left">
                <router-link to="/"><v-img contain :src="require('@/assets/imgs/logo.png')" class="nav-logo pointer"></v-img></router-link>
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
                    <v-btn flat @click="openDialog" class="funds-btn">Add Funds</v-btn>
                    <v-btn flat @click="drawer = !drawer" class="user-name">{{$store.state.userData.user_name}}</v-btn>
                    <deposits :dialog="showDepositDialog" @close="closeDialog"></deposits>
                    <div v-if="drawer" class="menu">
                        <v-list class="dropdown">
                            <v-list-tile class="user-menu pointer">
                                <v-list-tile-title class="c-green-bright pointer">${{parseFloat($store.state.userData.balance).toFixed(2)}}</v-list-tile-title>
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
        height: 125px;
        float: left;
        background: $darkest;
        background-size: cover;
        margin: 1rem 4rem 1rem 0;
        position: relative;
        transition: background-image .35s;
        box-shadow: 2px 2px 12px $black;
        border-radius: 4px;
        &:after {
            content: "";
            position: absolute;
            opacity: 0;
            z-index: -100;
            top: -3px;
            left: -3px;
            height: 132px;
            width: 187px;
            border-radius: 4px;
            background: $gradient;
            -webkit-filter: blur(1px);
            -moz-filter: blur(1px);
            -o-filter: blur(1px);
            -ms-filter: blur(1px);
            filter: blur(1px);
            -webkit-transition: all 0.35s;
            transition: all 0.35s;
        }


        &:hover{
            &:before {
                display: none;
            }
            &:after {
                opacity: 0.8;;
            }
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
            margin: 1rem auto;
        }
        .open-btn{
            height: 35px;
            color: $white !important;
            background-image: $gradient !important;
            border-radius: 50px;
            font-size: 12px;
            position: absolute;
            top: calc(55% - 30px);
            left: 16%;
            display: none;
            transition: display .35s;
        }
    }
    .navbar{
        background: $dark3;
        padding: 1.3rem 100px;
    }
    .nav-logo{
        width: 150px;
        height: auto;
        margin: 0;
    }
    .user-name{
        text-transform: uppercase;
        font-weight: 600;
        height: 50px;
        padding: 0;
        margin: 1rem 0 0 2rem;
        font-size: 16px;
        .v-btn__content{
            background: $gradient !important;
            background-clip: text !important;
            -webkit-text-fill-color: transparent;
        }
        &:before{
            display: none;
        }
        &:hover{
            &:before{
                display: none;
            }
        }
    }
    .funds-btn{
        color: white;
        font-size: 16px;
        height: 50px;
        padding: 1rem 1.5rem !important;
        margin: 1rem 0 0 2rem;
        background: $gradient !important;
        border-radius: 50px;
        font-weight: 600;
        text-transform: capitalize;
        &:before{
            display: none !important;
        }
        &:hover{
            box-shadow: 2px 2px 15px $black;
        }
    }
    .nav-link{
        color: white;
        font-size: 16px;
        height: 50px;
        padding: 0;
        margin: 1rem 0 0 2rem;
        font-weight: 600;
        position: relative;
        &:before {
            content: '';
            position: absolute;
            display: none;
            width: 100%;
            height: 2px;
            top: 82px;
            background: linear-gradient(to right, $red, $orange);
            opacity: 1 !important;
        }
        &:hover{
            &::before{
                display: block !important;
            }
        }
    }
    .login-btn{
        width: 145px;
        height: 50px;
        margin: 1rem 0 0 2rem;
        font-size: 16px;
        background: $gradient !important;
        border-radius: 50px;
        border: none;
        &:hover{
            background: transparent !important;
        }
    }

    .nav-link.v-btn--active{
        color: $orange;
        font-size: 16px;
        .v-btn__content{
            background: $gradient !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent;
        }
        &:before {
            content: '';
            position: absolute;
            display: block;
            width: 100%;
            height: 2px;
            top: 82px;
            background: linear-gradient(to right, $red, $orange);
            opacity: 1 !important;
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
            background-color: $dark4;
            .dropdown{
                background-color: $dark4;
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
