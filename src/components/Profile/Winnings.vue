<template>
    <v-container grid-list-xs class="winnings">
        <v-layout mb-5 row wrap class="section-container">
            <v-flex xs12>
                <h2 class="uppercase m-b">Unsold Items</h2>
            </v-flex>
            <v-flex xs12 class="">
                <div class="unsold m-r-2 m-b-2" v-for="(item, index) in itemsAvailable" :key="index">
                    <v-btn :loading="soldLoading" @click="sellItem(item)" class="sell-btn t-c">Sell</v-btn>
                    <v-btn :loading="withdrawLoading" @click="withdrawItem(item)" class="withdraw-btn">Withdraw</v-btn>
                    <v-img contain :src="item.item.iconUrl" class="winning-img"></v-img>
                    <p class="t-c m-t-2">${{item.item.price}}</p>
                </div>
            </v-flex>
        </v-layout>

        <v-layout mt-5 row wrap class="section-container">
            <v-flex xs12>
                <h2 class="uppercase m-b">Sold Items</h2>
            </v-flex>
            <v-flex xs12>
                <div class="sold m-r-2 m-b-5" v-for="(item, index) in itemsSold" :key="index">
                    <v-img contain :src="item.item.iconUrl" class="winning-img"></v-img>
                    <p class="t-c m-t-3">Sold</p>
                </div>
            </v-flex>
        </v-layout>

        <v-layout mt-5 row wrap class="section-container">
            <v-flex xs12>
                <h2 class="uppercase m-b">Withdrawn Items</h2>
            </v-flex>
            <v-flex xs12>
                <div class="sold m-r-2 m-b-5" v-for="(item, index) in itemsWithdrawn" :key="index">
                    <v-img contain :src="item.item.iconUrl" class="winning-img"></v-img>
                    <p class="t-c m-t-3 c-green">Withdrawn</p>
                </div>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import Api from './../../services/Api.js';

export default {
    name: 'cases',
    data: function() {
        return {
            myCases: [],
            itemsSold: [],
            itemsWithdrawn: [],
            itemsAvailable: [],
            soldLoading: false,
            withdrawLoading: false
        }
    },
    mounted: function() {
        this.getWinnings()
        // this.getUserCases()
    },
    methods: {
        getWinnings: function(){
            let $object = new Api('/user/winning')
            let params = { user_id: this.$store.state.userData._id }
            $object.post(params).then(response => {
                this.itemsSold = response.sold_items
                this.itemsWithdrawn = response.withdrawn_items
                this.itemsAvailable = response.unsold_items
            })
        },
        getUserCases: function(){
            let $object = new Api('/cases/user')
            let params = { user_id: this.$store.state.userData._id }
            $object.post(params).then(response => {
                this.myCases = response
            })
        },
        deleteCase: function(oneCase) {
            let self = this;
            let api = new Api('/cases')
            api.delete(oneCase._id).then(response =>{
                self.myCases = self.myCases.filter(function(value, index, arr) {
                    return value._id != oneCase._id;
                });
            }).catch(() => {
                this.showMessage("Failed to delete case")
            })
        },
        sellItem: function(item){
            this.soldLoading= true
            let $object = new Api('/user/trade/sell')
            $object.post(item).then(response =>{
                this.$store.commit('addUser', response.user)
                this.getWinnings()
                this.soldLoading = false
            }).catch(()=>{
                this.soldLoading = false
            })
        },
        withdrawItem: function(item){
            this.withdrawLoading= true
            let $object = new Api('/user/trade/withdraw')
            $object.post(item).then(response =>{
                this.withdrawLoading = false
                window.location.replace(response.url)
            }).catch((error)=>{
                this.withdrawLoading = false
                this.showMessage(error.response.data.message)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/variables.scss';

.winnings{
    max-width: 100%;
    margin: 0 auto;
    padding: 0;
}
.section-container {
    text-align: left !important;
    
    .unsold {
        position: relative;
        padding-left: 10px;
        padding-top: 25px; 
        display: block;
        float: left;
        background-image: url('../../assets/imgs/case-back-dark.svg');
        background-size: 200px;
        width: 200px;
        min-height: 200px;
        transition: background-image .35s;
        position: relative;
        &:before {
            content: '';
            position: absolute;
            display: none;
            top: 1px;
            left: 1px;
            right: 1px;
            bottom: 1px;
            z-index: -1px;
            opacity: .45;
            background: linear-gradient(to bottom, $red, $orange);
        }
        &:hover{
            &:before{
                display: block;
            }
            .winning-img{
                opacity: .35;
            }
            .sell-btn{
                display: block;
            }
            .withdraw-btn{
                display: block;
            }
        }

        .winning-img {
            width: 70%;
            margin: 2rem auto;
        }
        .sell-btn{
            color: $white;
            position: absolute;
            top: 25%;
            left: 23%;
            font-size: 14px;
            z-index: 10;
            display: none;
            border-radius: 50px;
            background: $green;
            transition: display .35s;
        }
        .withdraw-btn{
            color: $white;
            position: absolute;
            top: 48%;
            left: 16%;
            font-size: 14px;
            z-index: 10;
            display: none;
            border-radius: 50px;
            background: $red;
            transition: display .35s;
        }
    }
    .sold {
         position: relative;
        padding-left: 10px;
        padding-top: 25px; 
        display: block;
        float: left;
        background-image: url('../../assets/imgs/case-back-dark.svg');
        background-size: 200px;
        width: 200px;
        min-height: 200px;
        transition: background-image .35s;
        position: relative;
        &:before {
            content: '';
            position: absolute;
            display: none;
            top: 1px;
            left: 1px;
            right: 1px;
            bottom: 1px;
            z-index: -1px;
            opacity: .45;
            background: linear-gradient(to bottom, $red, $orange);
        }
        
        &:hover{
            &:before{
                display: block;
            }
        }
        p{
            color: $red;
        }
        .winning-img {
            width: 70%;
            margin: 2rem auto;
        }
    }
}
</style>
