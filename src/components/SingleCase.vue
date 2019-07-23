<template>
    <div class="spacing" v-if="oneCase != null">
        <div>
            <div class="name-wrapper">
                <h2 class="uppercase heading">{{oneCase.name}}</h2>
                <p class="red-text">{{oneCase.creator}}</p>
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
                <v-btn class="button green-btn" @click.stop="showDialog = true">Open Case</v-btn>
                <v-btn color="button" class="button spin-button" id="spin" @click="mixItems">Test Spin</v-btn>
            </div>
        </div>

        <v-container grid-list-lg fluid class="case-container">
            <v-layout row wrap>
                <v-flex xs12>
                    <h3 class="uppercase">This Case Contains</h3>
                </v-flex>
                <v-flex xs12 md4 lg3 v-for="(item, index) in oneCase.items" :key="index">
                    <div class="skin">
                        <div class="price">
                            <h4 class="t-c capitalize">${{item.price}} <i class="fas fa-coins coins"></i></h4>
                        </div>
                        <v-img contain :src="item.iconUrl" class="skin-image"></v-img>
                        <div class="name">
                            <h4>{{item.marketHashName}}</h4>
                        </div>
                        <div class="action">
                            <p>{{item.odds}}%</p>
                        </div>
                    </div>
                </v-flex>
            </v-layout>
        </v-container>

        <v-container grid-list-md class="section-container">
            <h3 class="uppercase">Recent Winnings</h3>
            <div class="p-2">
                <div class="winning m" v-for="(item, index) in itemsWon" :key="index">
                    <v-img contain :src="item.item.iconUrl" class="winning-img"></v-img>
                </div>
            </div>
        </v-container>

        <v-dialog width="800px" persistent v-model="showDialog">
            <v-card class="dialog">
                <h2 class="t-c">Confirm Order</h2>
                <v-img contain :src="require('@/assets/imgs/cases/' + this.oneCase.case_image)" class="case-open-img"></v-img>
                <div class="case-name">
                    <div class="left-wrapper">
                        <p class="bold">Case Name:</p>
                    </div>
                    <div class="right-wrapper">
                        <h4>{{oneCase.name}}</h4>
                    </div>
                </div>
                <div class="case-prices">
                    <div class="left-wrapper">
                        <p class="bold">Case Price:</p>
                    </div>
                     <div class="right-wrapper">
                        <h4>${{oneCase.price}}</h4>
                    </div>
                </div>
                <div class="case-hash">
                    <div class="left-wrapper">
                        <p class="bold">Case Hash #:</p>
                    </div>
                    <div class="right-wrapper">
                        <p>{{clientHash}}</p>
                    </div>
                </div>

                <div class="case-buttons">
                    <v-btn class="button" @click="showDialog = false">Close</v-btn>
                    <v-btn color="button" :loading="hashLoading" @click="getClientHash()">New Hash</v-btn>
                    <v-btn class="button green-btn" :loading="purchaseLoading"  @click="buyCase()">Buy Case</v-btn>
                </div>
            </v-card>
        </v-dialog>
        
        <win :dialog="showWinningDialog" @closeDialog="closeWinningDialog"></win>
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
  },
  methods: {
    buyCase: function() {
      if(this.$store.state.userData){
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
              let item = this.oneCase.items.find(item => (item.marketHashName === response.winning.winningItem))
              this.$store.commit('refreshWinningItem', response.winning)
              this.spinnerItems[124] = item;
              var spin = document.getElementById("spin");
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
      this.spinnerItems = this.shuffleItems(this.createCaseItems(this.oneCase.items));
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../assets/scss/variables.scss";
@import "../assets/scss/util.scss";

.dialog {
  background-color: $purple-dull;
  padding: 2rem;
  .case-open-img {
    width: 15rem;
    height: auto;
    display: block;
    margin: 2rem auto;
  }
  .case-name,
  .case-prices,
  .case-hash {
    padding: 1rem;
    border-top: 1px solid rgba(#fff, 0.15);
  }
  .left-wrapper {
    width: 25%;
    display: inline-block;
  }
  .right-wrapper {
    width: 75%;
    display: inline-block;
    p {
      vertical-align: top;
    }
  }
  p {
    font-size: 1rem;
    display: inline-block;
  }
  .case-hash {
    border-bottom: 1px solid rgba(#fff, 0.15);
  }
  .case-buttons {
    margin-top: 1rem;
    width: fit-content;
    margin: 1rem auto 1rem auto;
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
  margin: 4rem 0px;
  .spinner {
    width: 100%;
    height: 163px;
    background: #73337a77;
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
      border: 2px solid #4caf50;
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
  }
}

.heading {
  display: inline-block;
}
.speaker-icon {
  width: 50px;
  height: auto;
  display: inline-block;
  vertical-align: middle;
  color: #fff !important;
}

.red-text {
  color: $red;
  margin: 0px;
  font-size: 0.75rem;
}

.case-container {
  margin: 4rem 0px;
  h3 {
    margin: 2rem 0px;
  }
}
.section-container {
  .winning {
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
.button {
  background-color: $purple-bright-extra !important;
  color: #fff;
  border-radius: 0px;
  font-weight: 600;
  min-height: 50px;
}

.green-btn {
  background-color: $green-dull !important;
}

.number-input {
  background-color: #fff;
  color: $purple-dark;
  padding: 0px 0px 0px 10px;
  min-height: 50px;
  width: 50px;
  margin: 0px 8px;
}
.skin {
  min-height: 370px;
  background: #67266e77;
  position: relative;
  overflow-y: auto;
  .price {
    background: #73337a77;
    padding: 20px 10px;

    .coins {
      color: gold;
    }
  }
  .skin-image {
    display: block;
    margin: 20px auto;
    width: 200px;
    height: 200px;
  }
  .name {
    width: 80%;
    float: left;
    padding: 10px;
    cursor: pointer;
  }
  .action {
    position: absolute;
    bottom: 0px;
    right: 0px;
    padding: 10px 20px;
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
