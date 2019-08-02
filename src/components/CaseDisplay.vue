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
  min-height: 370px;
  padding: .5rem 0 0 0;
  background-image: url('../assets/imgs/case-back-dark.svg');
  background-size: cover;
  margin: 2rem; 
  display: inline-block;
  position: relative;
  overflow-y: auto;
  box-shadow: 0px 2px 12px $black;
  border-radius: 4px;
  &:before {
    content: '';
    position: absolute;
    opacity: 0;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: -1px;
    border-radius: 4px;
    background: linear-gradient(to bottom, $red, $orange);
    transition: opacity 0.35s;
  }

  &:hover{
    &:before{
      opacity: 0.45;
    }
  }
  .price {
    padding: 1rem .7rem;
  }
  .skin-image {
    display: block;
    margin: .2rem auto;
    width: 170px;
    height: 170px;
    transition: width 0.35s;
  }
  .name {
    width: 100%;
    padding: .7rem;
    word-wrap: break-word;
  }
}
</style>
