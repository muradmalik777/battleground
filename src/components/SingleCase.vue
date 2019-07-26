<template>
    <div class="spacing" v-if="oneCase != null">
        <div>
            <div class="name-wrapper">
                <h2 class="uppercase heading">{{oneCase.name}}</h2>
            </div>
            <div class="price-wrapper">
                <h1 class="price">${{parseFloat(oneCase.price).toFixed(2)}}</h1>
            </div>
        </div>

        <div class="spinner-wrapper">
            <div class="spinner">
                <div class="wrapper">
                    <div class="window">
                        <ul class="list">
                            <li v-for="(item, index) in spinnerItems" :key="index"><v-img contain class="spinner-image" :src="item.iconUrl"></v-img></li>
                        </ul>
                    </div>
                    <div class="line"></div>
                </div>
            </div>
            <div class="spinner-controls">
                <v-btn class="open-btn btn" @click.stop="showDialog = true">Open Case</v-btn>
                <v-btn outline class="btn spin-btn spin-button" id="spin" @click="mixItems">Test Spin</v-btn>
            </div>
        </div>

        <v-container grid-list-lg fluid class="case-container">
            <v-layout row wrap>
                <v-flex xs12>
                    <h3 class="uppercase t-c">This Case Contains</h3>
                </v-flex>
                <v-flex xs12 class="text-xs-center">
                    <div class="skin" v-for="(item, index) in oneCase.items" :key="index">
                        <div class="price">
                          <h4 class="t-c capitalize">${{item.price}} <i class="fas fa-coins coins"></i></h4>
                          <p>odds: {{item.odds}}%</p>
                        </div>
                        <v-img contain :src="item.iconUrl" class="skin-image"></v-img>
                        <div class="name">
                            <h4>{{item.marketHashName}}</h4>
                        </div>
                    </div>
                </v-flex>
            </v-layout>
        </v-container>

        <v-dialog width="800px" persistent v-model="showDialog">
            <v-card class="buy-dialog">
              <v-card-text>
                <v-layout row>
                    <v-flex xs4 class="image-side text-xs-left">
                        <v-img class="case-image" contain :src="require('@/assets/imgs/case.png')"></v-img>
                    </v-flex>
                    <v-flex xs8>
                        <h2 class="m-b uppercase">Confirm Order</h2>
                        <h4>Case Name: {{this.oneCase.name}}</h4>
                        <h4>Case Name: {{this.oneCase.price}}</h4>
                        <h4>Case Hash # {{this.clientHash}}</h4>

                    </v-flex>
                </v-layout>
              </v-card-text>
              <v-card-actions class="m-t">
                <v-flex xs12 class="text-xs-center">
                  <v-btn class="buy-btn btn" :loading="purchaseLoading"  @click="buyCase()">Buy Case</v-btn>
                  <v-btn color="hash-btn btn" :loading="hashLoading" @click="getClientHash()">New Hash</v-btn>
                  <v-btn class="close-btn btn" outline @click="showDialog = false">Close</v-btn>
                  <v-btn class="buy-button" id="buy" style="visibility:hidden"></v-btn>
                </v-flex>
              </v-card-actions>
            </v-card>
        </v-dialog>
        
        <win v-if="showWinningDialog" :dialog="showWinningDialog" @closeDialog="closeWinningDialog"></win>

    </div>
</template>
<script>
import Api from "../services/Api.js";
import WinningDialog from '@/components/WinningDialog'
import * as $ from "jquery";
window["$"] = $;
window["jQuery"] = $;

export default {
  name: "SingleCase",
  components: {
    'win': WinningDialog
  },
  data: function() {
    let data = this.$store.state.caseBeingOpened;
    return {
      number: 1,
      showWinningDialog: false,
      showDialog: false,
      oneCase: data,
      spinnerItems: [],
      clientHash: null,
      hashLoading: false,
      purchaseLoading: false,
      itemsWon: []
    };
  },
  mounted: function() {
    this.getCaseWinnings();
    this.getClientHash();
    this.spinnerItems = this.shuffleItems(this.createCaseItems(this.oneCase.items));
    $(".spin-button").click(function() {
      $(".window").css({
        right: "0"
      });
      $(".list li").css({
        border: "4px solid transparent"
      });
      // $(".list li:eq(" + 124 + ")").css({
      //   border: "3px solid #4caf50"
      // });
      $(".window").animate(
        {
          right: 135 * 135
        },
        9000
      );
    });

    $(".buy-button").click(function() {
      $(".window").css({
        right: "0"
      });
      $(".list li").css({
        border: "4px solid transparent"
      });
      $(".window").animate(
        {
          right: 135 * 135
        },
        9000
      );
    });
  },
  methods: {
    buyCase: function() {
      if(this.$store.state.userData){
        $(".window").css({
          right: "0"
        });
        this.mixItems()
        this.purchaseLoading = true;
        let $purchase = new Api("/purchases");
        let data = {
          user_id: this.$store.state.userData._id,
          case_id: this.oneCase._id,
          hash: this.clientHash
        }
        $purchase.post(data).then(response => {
          if (response.purchased) {
            this.$store.commit("addUser", response.user);
            this.purchaseLoading = false;
            this.showDialog = false;
            this.$store.commit('refreshWinningItem', response.winning)
            this.spinnerItems[124] = response.winning.item;
            var spin = document.getElementById("buy");
            this.getClientHash()
            spin.click();
            this.$store.commit('refreshLastCaseOpened', this.$store.state.caseBeingOpened)
            setTimeout(function(){
              this.showWinningDialog = true
            }.bind(this), 9000);
          }
        }).catch(error => {
          this.purchaseLoading = false;
          this.showMessage(error.response.data.message)
        });
      } else{
        this.$router.push('/login')
      }
    },
    getClientHash: function() {
      this.hashLoading = true;
      let $hash = new Api("/hash");
      $hash
        .getList()
        .then(response => {
          this.clientHash = response;
          this.hashLoading = false;
        })
        .catch(() => {
          this.hashLoading = false;
        });
    },
    getCaseDetails: function() {
      let api = new Api("/cases");
      api
        .get(this.$route.params.case_id)
        .then(response => {
          self.oneCase = response;
        })
        .catch(() => {});
    },
    getCaseWinnings: function() {
      let $object = new Api("/case/winning");
      let params = { case_id: this.oneCase._id };
      $object.post(params).then(response => {
        this.itemsWon = response;
      });
    },
    openWinningDialog: function(){
      this.showWinningDialog = true
    },
    closeWinningDialog: function(){
      this.showWinningDialog = false
    },
    mixItems: function(){
      this.spinnerItems = this.shuffleItems(this.spinnerItems);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../assets/scss/variables.scss";

.buy-dialog {
  background-color: $dark3;
  padding: 2rem;
  .case-image {
    width: 150px;
    height: auto;
    display: block;
    margin: 1rem auto;
  }
  .btn{
    color: $white !important;
    float: right !important;
    margin-right: 1rem !important;
    border-radius: 50px;
    width: 140px;
    height: 45px;
  }
  .hash-btn {
    background: $red !important;
  }
  .buy-btn {
    background: $green !important;
  }
}
.skin-image {
  display: block;
  margin: 20px auto;
  width: 150px;
  height: 100px;
}
.name-wrapper {
  width: 50%;
  display: inline-block;
  text-align: left;
}

.price-wrapper {
  width: 50%;
  display: inline-block;
  text-align: right;
}

.spinner-wrapper {
  margin: 2rem 0px;
  .spinner {
    width: 100%;
    height: 163px;
    background: $dark3;
    li {
      list-style: none;
      display: inline-block;
      float: left;
    }

    .window {
      overflow: hidden;
      position: relative;
      width: 25000px;
      height: 163px;
      right: 0px;
      padding: 10px;
    }

    .wrapper {
      position: relative;
      margin: auto;
      width: 100%;
      overflow-x: hidden;
      overflow-y: hidden;
    }

    .line{
      width: 1px;
      height: 200px;
      position: absolute;
      top: 0;
      left: 50%;
      border: 2px solid $green;
    }

    .list {
      position: relative;
      margin-left: 230;
      display: inline-block;
    }

    .list li {
      border: 4px solid transparent;
    }
    .spinner-image {
      width: 135px;
      height: 135px;
      margin: 5px;
    }
  }
  .spinner-controls {
    display: block;
    width: fit-content;
    margin: 2rem auto;

    .open-btn{
      background: $red !important;
    }
    .btn{
      color: $white !important;
      margin-right: 1rem !important;
      border-radius: 50px;
      width: 140px;
      height: 45px;
    }
  }
}

.heading {
  display: inline-block;
}

.case-container {
  margin: 4rem 0px;
  h3 {
    margin: 2rem 0px;
  }
}
.section-container {
  background: transparent;
  .winn {
    padding-left: 10px;
    padding-top: 25px; 
    display: block;
    float: left;
    background: url('../assets/imgs/svg/winning-circle.svg');
    background-size: 120px;
    width: 120px;
    height: 120px;

    .winning-img {
      width: 100%;
    }
  }
}

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

@media only screen and (min-width: 1300px) and (max-width: 1445px){
  .spinner-wrapper {
    .spinner {
      .spinner-image {
        width: 133.3px;
        height: 133.3px;
        margin: 5px;
      }
    }
  }
}

@media only screen and (min-width: 1921px) and (max-width: 2561px){
  .spinner-wrapper {
    .spinner {
      .spinner-image {
        width: 137.7px;
        height: 137.7px;
        margin: 5px;
      }
    }
  }
}
</style>
