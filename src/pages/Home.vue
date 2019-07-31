<template>
<div>
    <credits></credits>
    <v-container grid-list-md class="home">
        <v-layout class="bid-cases" row wrap mt-3>
            <v-flex xs12 md12 lg12 mb-5 class="text-xs-center">
                <v-btn flat outline color="#fff" :class="{'active-btn': active === 1}" class="filter-btn" @click="filterCases(1)">official cases</v-btn>
                <v-btn flat outline color="#fff" :class="{'active-btn': active === 2}" class="filter-btn" @click="filterCases(2)">new cases</v-btn>
                <v-btn flat outline color="#fff" :class="{'active-btn': active === 3}" class="filter-btn" @click="filterCases(3)">trending cases</v-btn>
            </v-flex>
            <v-flex xs12  class="text-xs-center">
                <div class="case pointer" v-for="(item, i) in allCases" :key="i" @click="openCase(item)">
                    <v-img :src="require('@/assets/imgs/case.png')" class="case-image"></v-img>
                    <h3 class="capitalize t-c">{{item.name}}</h3>
                    <h3 class="t-c capitalize price">${{parseFloat(item.price).toFixed(2)}}</h3>
                </div>
            </v-flex>
            <v-flex xs12 class="text-xs-center m-t-3">
                <v-btn flat outline color="#fff" :loading="loading" class="loading-btn">load more</v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</div>
</template>
<script>
import Api from '../services/Api.js';
import FreeCredits from '@/components/FreeCredits'

export default {
    name: 'Home',
    components: {
        'credits': FreeCredits
    },
    data: function() {
        return {
            allCases: [],
            currentPage: 1,
            active: 1,
            loading: false
        }
    },
    created: function() {
        this.getAllCases()
    },
    methods: {
        getAllCases: function(){
            let $object = new Api('/cases')
            let params = { p : this.currentPage }
            $object.getList(params).then(resp => {
                this.allCases = resp.items
                this.totalCases = resp.total_count
            })
        },
        openCase: function (item) {
            this.$store.commit('addCaseToBeOpened', item)
            this.$router.push('case/' + item.slug);
        },
        filterCases: function(num){
            this.active = num
        }
    }

}
</script>
<style lang="scss">
@import "../assets/scss/variables.scss";

.home{
    max-width: 90%;
    overflow: auto;
    min-height: 100vh;
    
    .bid-cases{
        .filter-btn{
            width: 200px;
            height: 50px;
            font-size: 16px;
            border-radius: 50px;
            border: 1px solid $red;
            &:hover{
                border-color: $red;
                &::before{
                    display: none;
                }
            }
        }
        .active-btn{
            background-image: $gradient !important;
            border: 2px solid $red;
            font-weight: 500;
        }
        .case{
            width: 280px;
            min-height: 340px;
            background-image: url('../assets/imgs/case-back-dark.png');
            background-size: cover;
            margin: 2rem; 
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
        .loading-btn{
            width: 230px;
            height: 60px;
            font-size: 18px;
            border-radius: 50px;
            border: 2px solid $red;
            text-transform: capitalize;
            &:hover{
                background-color: $red !important;
                color: $white !important;
            }
        }
    }
}
</style>
