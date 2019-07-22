<template>
    <v-container grid-list-xs fluid class="spacing">
        <v-layout mb-5 row wrap class="section-container">
            <v-flex xs12>
                <h3 class="uppercase">Unsold Items</h3>
            </v-flex>
            <v-flex xs12>
                <div class="unsold m-r-2 m-b-5" v-for="(item, index) in itemsAvailable" :key="index">
                    <v-btn :loading="soldLoading" color="#00cf20" @click="sellItem(item)" class="sell-btn">Sell</v-btn>
                    <v-btn :loading="withdrawLoading" color="#ff5151" @click="withdrawItem(item)" class="withdraw-btn">Withdraw</v-btn>
                    <v-img contain :src="item.item.iconUrl" class="winning-img"></v-img>
                    <p class="t-c m-t-2">${{item.item.price}}</p>
                </div>
            </v-flex>
        </v-layout>

        <v-layout mt-5 row wrap class="section-container">
            <v-flex xs12>
                <h3 class="uppercase">Sold Items</h3>
            </v-flex>
            <v-flex xs12>
                <div class="sold m-r-2 m-b-5" v-for="(item, index) in itemsSold" :key="index">
                    <v-img contain :src="item.item.iconUrl" class="winning-img"></v-img>
                    <p class="t-c m-t-3 c-green">Sold</p>
                </div>
            </v-flex>
        </v-layout>

        <v-layout mt-5 row wrap class="section-container">
            <v-flex xs12>
                <h3 class="uppercase">Withdrawn Items</h3>
            </v-flex>
            <v-flex xs12>
                <div class="sold m-r-2 m-b-5" v-for="(item, index) in itemsWithdrawn" :key="index">
                    <v-img contain :src="item.item.iconUrl" class="winning-img"></v-img>
                    <p class="t-c m-t-3 c-green">Withdrawn</p>
                </div>
            </v-flex>
        </v-layout>
        <!-- <v-layout row wrap class="section-container">
            <v-flex xs12>
                <h3 class="uppercase">My Cases</h3>
            </v-flex>
            <v-flex xs12 md4 lg3  v-for="i in myCases" :key="i._id">
                <v-card class="case m-t-2">
                <h6 class="case-name">{{i.name}}</h6>
                <v-img contain :src="require('@/assets/imgs/cases/' + i.case_image)" class="case-img m-a m-t-2 m-b-2"></v-img>
                <h5 class="case-price">${{i.price}}<v-img contain :src="require('@/assets/imgs/svg/coins.svg')" class="coins"></v-img></h5>
                <v-img contain :src="require('@/assets/imgs/svg/waste-bin.svg')" class="case-delete m-a" @click="deleteCase(i)"></v-img>
                </v-card>
            </v-flex>
        </v-layout> -->
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

.section-container {
    text-align: left !important;
    
    .unsold {
        position: relative;
        padding-left: 10px;
        padding-top: 25px; 
        display: block;
        float: left;
        background: url('../../assets/imgs/svg/winning-circle.svg');
        background-size: 200px;
        width: 200px;
        height: 200px;

        .winning-img {
            width: 100%;
        }
        .sell-btn{
            position: absolute;
            top: 25%;
            left: 27%;
            font-size: 14px;
            z-index: 10;
            display: none;
        }
        .withdraw-btn{
            position: absolute;
            top: 55%;
            left: 20%;
            font-size: 14px;
            z-index: 10;
            display: none;
        }
        &:hover{
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
    }
    .sold {
        position: relative;
        padding-left: 10px;
        padding-top: 25px; 
        display: block;
        float: left;
        background: url('../../assets/imgs/svg/winning-circle.svg');
        background-size: 200px;
        width: 200px;
        height: 200px;

        .winning-img {
            width: 100%;
        }
    }
    .case {
        width: 100%;
        text-align: center;
        display: inline-block;
        background: #67266e70;
        .case-name {
            font-size: 1rem;
        }
        .case-img {
            width: 50%;
            height: auto;
        }
        .case-price {
            font-size: 1rem;
            display: inline-block;
            vertical-align: middle;
            .coins {
                margin-left: 10px;
                width: 15px;
                height: auto;
                display: inline-block;
                vertical-align: middle;
            }
        }
        .case-delete {
            width: 25px;
            height: auto;
            margin-top: 10px;
            cursor: pointer;
            &:hover {
                background-color: rgba(#000, 0.2);
            }
        }
    }
}
</style>
