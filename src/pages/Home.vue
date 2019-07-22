<template>
    <v-container class="home">
        <v-layout class="bid-cases" row wrap>
            <v-flex xs12 md12 lg12>
                <h2 class="uppercase">Open cases <span class="uppercase c-purple-bright m-l">view selection</span></h2>
            </v-flex>
            <v-flex xs12 sm4 md3 lg2 class="case pointer m-t-3 m-b-3" v-for="(item, index) in allCases" :key="index" @click="openCase(item)">
                <h3 class="capitalize t-c">{{item.name}}</h3>
                <v-img :src="require('@/assets/imgs/cases/' + item.case_image)" class="case-image"></v-img>
                <h4 class="t-c capitalize price">${{parseFloat(item.price).toFixed(2)}}</h4>
            </v-flex>
            <v-flex xs12 class="text-xs-center m-t-3" v-if="totalCases && totalCases > 12">
                <v-pagination
                v-model="currentPage"
                :length="Math.ceil(totalCases/12)"
                :total-visible="10"
                @input="getAllCases">
                </v-pagination>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import Api from '../services/Api.js';

export default {
    name: 'home',
    data: function() {
        return {
            allCases: [],
            currentPage: 1,
            totalCases: null,
        }
    },
    created: function() {
        if(!this.$store.state.allCases){
            this.getAllCases()
        }
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
        }
    }

}
</script>
<style lang="scss">
.home{
    max-width: 90%;
    overflow: auto;
    min-height: 100vh;
    .banner{
        padding: 35px;
        background: #73337a65;
    }
    .bid-cases{
        h2{
            span{
                font-size: 14px;
            }
        }
        .case{
            min-height: 250px;
            padding: 15px;
            &:hover{
                background: #00cf2099;
            }
            .coins{
                color: gold;
                margin-left: 10px;
            }
            .case-image{
                display: block;
                margin: 2rem auto;
                width: 150px;
                height: auto;
            }
        }
    }
}
</style>
