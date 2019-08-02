<template>
<div>
    <credits></credits>
    <v-container grid-list-md class="home">
        <v-layout class="bid-cases" row wrap>
            <v-flex xs12 md12 lg12 mb-5 class="text-xs-center">
                <v-btn flat outline color="#fff" :class="{'active-btn': active === 1}" class="filter-btn" @click="filterCases(1)">official cases</v-btn>
                <v-btn flat outline color="#fff" :class="{'active-btn': active === 2}" class="filter-btn" @click="filterCases(2)">new cases</v-btn>
                <v-btn flat outline color="#fff" :class="{'active-btn': active === 3}" class="filter-btn" @click="filterCases(3)">trending cases</v-btn>
            </v-flex>
            <v-flex xs12  class="text-xs-center">
                <div class="case" v-for="(item, i) in allCases" :key="i">
                    <v-img :src="require('@/assets/imgs/newcase.svg')" class="case-image"></v-img>
                    <h3 class="capitalize t-c">{{item.name}}</h3>
                    <h3 class="t-c capitalize price">${{parseFloat(item.price).toFixed(2)}}</h3>
                    <v-btn flat outline color="#fff" @click="openCase(item)" class="open-btn">Open</v-btn>
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
            background: $dark2 !important;
            box-shadow: 2px 2px 10px $black;
            &:hover{
                border: none !important;
                background: $gradient !important;
                &::before{
                    display: none;
                }
            }
        }
        .active-btn{
            background-image: $gradient !important;
            border: none !important;
        }
        .case{
            width: 280px;
            min-height: 340px;
            background-image: url('../assets/imgs/case-back-dark.svg');
            background-size: cover;
            margin: 2rem; 
            display: inline-block;
            position: relative;
            box-shadow: 0px 2px 12px $black;
            border-radius: 4px;
            &:before {
                content: '';
                position: absolute;
                opacity: 0;
                top: 1px;
                left: 1px;
                right: 1px;
                bottom: 1px;
                z-index: -1px;
                background: linear-gradient(to bottom, $red, $orange);
                transition: opacity 0.35s; 
            }

            &:hover{
                &:before{
                    opacity: .45 !important;
                }
                .open-btn{
                    display: block;
                }
            }
            .price{
                color: $orange;
            }

            .case-image{
                display: block;
                margin: 2rem auto;
                width: 280px;
                height: auto;
                transition: width 0.35s;
            }
            .open-btn{
                min-width: 150px;
                height: 50px;
                background: $gradient !important;
                font-size: 16px;
                border-radius: 50px;
                border: none;
                text-transform: capitalize;
                display: none;
                position: absolute;
                top: calc(55% - 50px);
                left: 20%;
            }
        }
        .loading-btn{
            width: 200px;
            height: 50px;
            font-size: 16px;
            border-radius: 50px;
            border: 1px solid $red;
            box-shadow: 2px 2px 10px $black;
            text-transform: capitalize;
            background: $dark2 !important;
            &:hover{
                background: $gradient !important;
                border: none !important;
                color: $white !important;
            }
        }
    }
}
</style>
