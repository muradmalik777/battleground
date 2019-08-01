<template>
    <v-container class="profile spacing m-t-2">
        <v-layout row wrap justify-start>
        <v-flex xs3 class="text-xs-left">
            <div class="profile-overview">
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

        <v-flex xs3>
            <router-link to="withdrawl" class="selector" :class="{'active': this.$route.path.includes('/profile/withdrawl')}">
                <div>
                    <p>Withdrawls</p>
                    <div class="icon-container">
                        <v-img contain :src="require('@/assets/imgs/svg/' + 'money' + '.svg')" class="icon"></v-img>
                    </div>
                </div>
            </router-link>
        </v-flex>
        </v-layout>

        <v-layout row mt-5>
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
<style lang="scss">
@import '../assets/scss/variables.scss';

.profile{
    max-width: 100%;
    margin: 0 auto;
}
.profile-overview {
    height: 120px;
    width: 80%;
    background: $dark3;
    padding: 10px 25px;
    border-radius: 5px;

    .stats {
        display: inline-block;
        vertical-align: middle;
        .name {
            font-size: 1.5rem;
            font-weight: 600;
            margin-top: 1rem;
            color: $red;
        }
        .balance {
            font-weight: 600;
            text-align: left !important;
            margin-top: .5rem;
        }
    }
}
.selector {
    width: 80%;
    height: 120px;
    background-color: $dark3;
    display: inline-block;
    padding: 10px 25px;
    border-radius: 5px;
    p {
        display: inline-block;
        font-weight: 600;
        width: 70%;
        text-align: left;
        margin-top: 2.3rem;
    }
    .icon-container {
        display: inline-block;
        width: 30%;
        .icon {
            width: 50px;
            height: 75px;
            display: inline-block;
            vertical-align: middle;
        }
    }
    &:hover{
        background: $gradient;
    }
    &.active {
        background: $gradient;
    }
}
</style>
