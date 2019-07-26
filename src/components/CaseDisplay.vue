<template>
    <v-container grid-list-xl class="spacing">
        <v-layout row wrap >
            <v-flex xs12>
                <h1>{{$store.state.caseBeingBrowsed.name}}</h1>
                <h3 class="capitalize price m-b-2">Price: ${{$store.state.caseBeingBrowsed.price}} <i class="fas fa-coins coins"></i></h3>
            </v-flex>
            <v-flex xs12>
                <div class="skin m-r-2 m-b-2" v-for="(item, index) in $store.state.caseBeingBrowsed.items" :key="index">
                    <div class="price">
                        <h4 class="t-c capitalize">${{item.price}} <i class="fas fa-coins coins"></i></h4>
                        <p class="t-c">odds: {{item.odds}}%</p>
                    </div>
                    <v-img contain :src="item.iconUrl" class="skin-image"></v-img>
                    <div class="name">
                        <h4 class="t-c">{{item.marketHashName}}</h4>
                    </div>
                </div>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
export default {
    name: "CaseDisplay",
    data: function(){
        return{

        }
    }
}
</script>
<style lang="scss" scoped>
@import "../assets/scss/variables.scss";

.skin {
  width: 270px;
  min-height: 340px;
  padding: 0px;
  background-image: url('../assets/imgs/case-back-dark.png');
  background-size: cover;
  margin: 2rem; 
  display: inline-block;
  transition: background-image .35s;
  position: relative;
  overflow-y: auto;

  &:hover{
    background-image: url('../assets/imgs/case-back-light.png');
  }
  .price {
    padding: 20px 10px;
  }
  .skin-image {
    display: block;
    margin: 1rem auto;
    width: 130px;
    height: 130px;
    transition: width 0.35s;
  }
  .name {
    width: 100%;
    padding: 10px;
    cursor: pointer;
  }
}
</style>
