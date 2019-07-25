<template>
    <v-container>
        <v-layout row wrap justify-center>
        <v-flex xs3>
            <div class="profile-overview">
                <!-- <v-img contain :src="require('@/assets/imgs/icon.svg')" class="avatar"></v-img> -->
                <div class="stats">
                    <h3 class="name">{{user.user_name}}</h3>
                    <h4 class="balance c-green">${{parseFloat(user.balance).toFixed(2)}}</h4>
                </div>
            </div>
        </v-flex>
        <v-flex xs3>
            <router-link to="cases" class="selector" :class="{'active': this.$route.path.includes('/profile/cases')}">
                <div>
                    <p>Winnings</p>
                    <div class="icon-container">
                        <v-img contain :src="require('@/assets/imgs/svg/' + 'purse' + '.svg')" class="icon"></v-img>
                    </div>
                </div>
            </router-link>
        </v-flex>
        <v-flex xs3>
            <router-link to="transactions" class="selector" :class="{'active': this.$route.path.includes('/profile/transactions')}">
                <div>
                    <p>Transactions</p>
                    <div class="icon-container">
                        <v-img contain :src="require('@/assets/imgs/svg/' + 'money' + '.svg')" class="icon"></v-img>
                    </div>
                </div>
            </router-link>
        </v-flex>
        </v-layout>

        <v-layout row>
            <router-view></router-view>
        </v-layout>
    </v-container>
</template>
<script>
export default {
    name: 'profile',
    data: function () {
        return {
        }
    },
    computed: {
        user: function() {
            return this.$store.state.userData;
        }
    },
    mounted: function(){
        this.$router.push("/profile/cases")
    }
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/variables.scss';

.profile-overview {
    padding: 1rem;
    .avatar {
        width: 55px;
        height: auto;
        margin-right: 2rem;
        display: inline-block;
        vertical-align: middle;
    }
    .stats {
        display: inline-block;
        vertical-align: middle;
        .name {
            font-size: 1.5rem;
            font-weight: 600;
        }
        .balance {
            font-weight: 600;
            text-align: left !important;
            margin-top: .5rem;
        }
    }
}
.selector {
    width: 90%;
    height: 100px;
    background-color: $dark3;
    display: inline-block;
    padding: 10px 25px;
    p {
        display: inline-block;
        font-weight: 600;
        width: 50%;
        text-align: left;
    }
    .icon-container {
        display: inline-block;
        width: 50%;
        .icon {
            width: 50px;
            height: 75px;
            display: inline-block;
            vertical-align: middle;
        }
    }
    &.active {
        background-color: $red;
    }
}
</style>
