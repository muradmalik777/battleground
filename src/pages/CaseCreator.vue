<template>
    <v-container grid-list-lg fluid class="case-creator spacing">
        <v-form ref="form">
        <v-layout row>
            <v-flex xs12 class="case-name">
                <h3 class="uppercase m-b">Case Name</h3>
                <v-text-field class="case-name-input" :rules="nameRules" required placeholder="Enter case name" type="text" full-width v-model="new_case.name"></v-text-field>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12>
                <h3 class="uppercase m-b-2 m-t-2">case picture</h3>
            </v-flex>
            <v-flex xs12 md12 lg12>
                <carousel :autoplay="true" :dots="false" :autoWidth="true">
                    <div v-for="image in 35" :key="image" class="case-image-box" :class="{'selected': selectedImage==image}">
                        <v-img :src="casePicture(image)" @click="selectPicture(image)" class="case-picture m-t-3"></v-img>
                    </div>
                </carousel>
            </v-flex>
        </v-layout>
        <v-layout row wrap pa-3>
            <v-flex xs12>
                <h3 class="uppercase">add skins</h3>
            </v-flex>
            <v-flex xs12 class="search">
                <v-autocomplete class="skin-search m-t" placeholder="search" v-model="search" :items="search_result"></v-autocomplete>
            </v-flex>
        </v-layout>

        <v-layout row wrap pa-3 class="items">
            <v-flex xs12 class="text-xs-center m-t-3" v-if="loading">
                <v-progress-circular
                :size="50"
                color="primary"
                indeterminate
                ></v-progress-circular>
            </v-flex>
            <v-flex v-else xs12 sm6 md3 lg3 class="m-t-3 pointer" v-for="(item, index) in allSkins" :key="index" @click="selectSkin(item)">
                <div class="skin">
                    <div class="price">
                        <h4 class="t-c capitalize">${{item.price}} <i class="fas fa-coins coins"></i></h4>
                    </div>
                    <v-img contain :src="item.iconUrl" class="skin-image"></v-img>
                    <div class="name">
                        <h4>{{item.marketHashName}}</h4>
                    </div>
                </div>
            </v-flex>
            <v-flex xs12 class="text-xs-center m-t-3">
                <v-pagination
                v-model="currentPage"
                :length="Math.ceil(totalItems/12)"
                :total-visible="10"
                @input="getAllItems"
                @next="getAllItems"
                @previous="getAllItems"
                ></v-pagination>
            </v-flex>
        </v-layout>

        <v-layout row pa-3 mt-5 wrap>
            <v-flex xs12>
                <h3 class="uppercase m-b">Choose Odds</h3>
            </v-flex>
            <v-flex v-for="(item, index) in selectedSkins" :key="item.id" xs12>
                <div class="odd">
                    <v-img contain :src="item.iconUrl" class="odd-image"></v-img>
                    <div class="name">
                        <h4>{{item.marketHashName}}</h4>
                    </div>
                    <div class="price">
                        <h4 class="t-c capitalize">${{item.price}}</h4>
                    </div>
                    <div class="percentage">
                        <v-text-field class="odd-percentage" :rules="numRules" placeholder="item odds" type="text" full-width v-model="itemOdds[index]"></v-text-field>
                    </div>
                    <div class="action">
                        <v-img contain :src="require('@/assets/imgs/svg/waste-bin.svg')" class="delete-icon"></v-img>
                    </div>
                </div>
            </v-flex>
            <v-flex xs12 md5 lg5 class="total_odds">
                <h4 class="t-c capitalize">Total Odds : 100% ({{parseFloat(remaining_odds.toFixed(2))}}% left)</h4>
            </v-flex>
            <v-flex xs12 md5 lg5 class="case_price">
                <h4 class="t-c capitalize">Case Price : ${{case_price}}</h4>
            </v-flex>
            <v-flex xs12 md2 lg2>
                <v-btn class="button green-btn" @click="createCase">Create Case</v-btn>
            </v-flex>
        </v-layout>
        </v-form>
    </v-container>
</template>
<script>
import Api from '@/services/Api'
import carousel from 'vue-owl-carousel'

export default {
    name: 'casecreator',
    components: { carousel },
    data: function(){
        return{
            new_case: {
                name: "",
                price: 0,
                case_image: "case2.png",
                items:[]
            },
            page: 1,
            selectedImage: 1,
            search: null,
            search_result: [],
            allSkins: [],
            selectedSkins: [],
            totalItems: null,
            itemOdds: [],
            loading: false,
            currentPage: 1,
            nameRules: [v => !!v || "The input is required"],
            numRules: [v => v > 0 && v <= 100 || "invalid Odds" ]
        }
    },
    created: function(){
        this.getAllItems()
    },
    computed: {
        remaining_odds: function() {
            let temp = 100;
            this.itemOdds.forEach(element => {
                temp = temp - element;
            });
            return temp;
        },
        case_price: function() {
            return this.new_case.price;
        }
    },
    methods: {
        casePicture: function(image){
            return require("@/assets/imgs/cases/case"+image+".png")
        },
        selectPicture: function(image){
            this.new_case.case_image = "case" + image + ".png"
            this.selectedImage = image
        },
        getAllItems: function(){
            this.loading = true
            let $items = new Api('/items')
            let params = { p : this.currentPage }
            $items.getList(params).then(resp => {
                this.allSkins = resp.items
                this.totalItems = resp.total_count
                this.loading = false
            }).catch(()=>{
                this.loading = false
            })
        },
        selectSkin: function(skin){
            this.selectedSkins.push(skin);
            this.new_case.price += parseFloat(skin.price.toFixed(2));
            this.new_case.items.push(skin);
            this.itemOdds.push(parseFloat(this.remaining_odds.toFixed(2)));
        },
        createCase: function() {
            if(this.$refs.form.validate()){
                if(this.new_case.items.length >= 2){
                    var totalOdds = 0
                    for(let a = 0; a < this.itemOdds.length; a++){
                        totalOdds += parseFloat(this.itemOdds[a])
                    }
                    if(totalOdds > 0 && totalOdds <= 100){
                        let $cases = new Api('/cases');
                        let self = this;
                        self.new_case.items.forEach(function(element, index) {
                            element.odds = String(self.itemOdds[index]);
                        });
                        let data = self.new_case;
                        data.user_id = this.$store.state.userData._id
                        $cases.post(data, {}).then(() => {
                            this.success = true
                            this.showMessage("Case Created Successfully")
                            this.$router.push("/")
                        }).catch(() => {
                            this.showMessage("There was an error creating case")
                        })
                    } else{
                        this.showMessage("Item odds should sum upto 100 and no item should have zero odds")
                    }
                } else {
                    this.showMessage("Please select atleast 2 skins")
                }
            } else {
                this.showMessage("Please fill in the details")
            }
        }
    }
}
</script>
<style lang="scss">
.case-creator{
    max-width: 90% !important;
}
.total_odds h4, .case_price h4{
    background-color: #73337a;
    padding: 1rem 2rem;
    height: 55px;
    margin: 4px 2rem 0 0;
}

.green-btn {
    background-color: #4caf50 !important;
    height: 50px;
}
.odd {
    margin: 1rem 0;
    background-color: #73337a;
    padding: 0 1rem;
    div {
        display: inline-block;
        vertical-align: middle;
    }
    .name {
        margin: 0 0 0 4rem;
        width: calc(50% - 4rem);
    }
    .price {
        width: calc(10% - 4rem);
        margin: 0 4rem;
    }
    .odd-image {
        // width: 20%;
        vertical-align: middle;
        width: 5rem;
        height: auto;
        display: inline-block;
    }
    .percentage {
        color: #fff !important;
        width: calc(20% - 4rem);
        margin: 0 4rem;
        .odd-percentage {
            background-color: rgba(#000, 0.5);
            color: #fff !important;
        }
    }
    .action {
        width: 4%;
        text-align: center;
        .delete-icon {
            vertical-align: middle;
            width: 1.5rem;
            height: auto;
        }
    }

}
.selected{
    background: #319c35;
    padding: 20px;
}
.items{
    min-height: 300px;
}
.case-creator{
    h3{
        padding-left: 1rem;
    }
    .case-name{
        .case-name-input{
            input{
                padding: 30px 10px;
                font-size: 16px;
                background: #73337a;
                color: #cccccc !important;
                caret-color: #cccccc;

                &::placeholder{
                    color: #aaaaaa;
                    text-transform: capitalize;
                }
            }
        }
    }
    .case-image-box{
        width: 200px;
        float: left;
        .case-picture{
            max-width: 130px;
            height: 90px;
            cursor: pointer;
            display: block;
            margin: 3rem auto;
        }
    }
    .select{
        margin-top: .7rem;
    }
    .skin{
        min-height: 370px;
        background: #67266e77;
        position: relative;
        overflow-y: auto;
        .price{
            background: #73337a77;
            padding: 20px 10px;

            .coins{
                color: gold;
            }
        }
        .skin-image{
            display: block;
            margin: 20px auto;
            width: 200px;
            height: 200px;
        }
        .name{
            width: 100%;
            float: left;
            padding: 10px;
            cursor: pointer;
        }
    }
}
</style>
