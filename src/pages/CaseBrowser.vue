<template>
    <v-container class="case-browser spacing m-t-2">
        <v-layout row wrap>
            <v-flex xs12>
                <div class="case pointer" v-for="item in cases" :key="item._id" @click="browseCase(item)">
                    <v-img contain :src="require('@/assets/imgs/case.png')" class="case-image"></v-img>
                    <h3 class="case-name t-c">{{item.name}}</h3>
                    <h3 class="t-c capitalize price">${{parseFloat(item.price).toFixed(2)}}</h3>
                </div>
            </v-flex>
            <v-flex xs12 class="text-xs-center m-t-3" v-if="totalCases && totalCases > 12">
                <v-pagination
                v-model="currentPage"
                :length="Math.ceil(totalCases/12)"
                :total-visible="10"
                @input="getAllCases"
                @next="getAllCases"
                @previous="getAllCases"
                ></v-pagination>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import Api from '../services/Api.js';

export default {
    name: "CaseBrowser",
    data: function(){
        return{
            search: null,
            cases: [],
            search_result: [],
            menu: [
                {name:"home", icon:"home", to:"/"}, 
                {name:"Case creator", icon:"pen", to: "/caseCreator"}, 
                {name:"case browser", icon:"avatar", to: "/caseBrowser"}, 
                {name:"support/faq", icon:"support", to: "/faq"},
                {name:"terms of service", icon:"info", to: "/tos"},
                {name:"about", icon:"info", to: "/about"}
            ],
            currentPage: 1,
            totalCases: null
        }
    },
    created: function() {
        this.getAllCases()
    },
    methods: {
        browseCase: function (item) {
            this.$store.commit('addBrowsedCase', item)
            this.$router.push('caseBrowser/' + item._id)
        },
        getAllCases: function(){
            let $object = new Api('/cases')
            let params = { p : this.currentPage}
            $object.getList(params).then(resp => {
                this.cases = resp.items
                this.totalCases = resp.total_count
            })
        },
    }
}
</script>
<style lang="scss">
@import "../assets/scss/variables.scss";

.case-browser{
    max-width: 100% !important;
    margin: 0 auto;
    padding-top: 0 !important;

    .search {
        .skin-search {
            width: calc(100%);
            display: inline-block !important;
            border-radius: 50px !important;
        }
    }
    .case{
        width: 280px;
        min-height: 340px;
        background-image: url('../assets/imgs/case-back-dark.png');
        background-size: cover;
        margin: 2rem 2rem 2rem 0; 
        display: inline-block;
        transition: background-image .35s;

        &:hover{
            background-image: url('../assets/imgs/case-back-light.png');
            .case-image{
                width: 220px;
            }
        }
        .price{
            color: $orange;
        }

        .case-image{
            display: block;
            margin: 2rem auto;
            width: 200px;
            height: 200px;
            transition: width 0.35s;
        }
    }
}
</style>
