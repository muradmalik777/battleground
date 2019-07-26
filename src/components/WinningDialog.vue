<template>
    <div class="text-xs-center">
        <v-dialog
        v-model="val"
        persistent
        class="win-dialog"
        width="900">

            <v-card class="win-dialog">
                <v-card-text>
                    <v-layout row>
                        <v-flex xs3 class="image-side">
                            <v-img class="win-image" contain :src="$store.state.winningItem.item.iconUrl"></v-img>
                        </v-flex>
                        <v-flex xs9>
                            <h2 class="c-white">{{$store.state.winningItem.item.marketHashName}}</h2>
                            <h4 class="c-white">Ticket: {{$store.state.winningItem.ticketNumber}}</h4>
                            <h4 class="c-white">Hash: {{$store.state.winningItem.clientHash}}</h4>
                            <h4 class="c-white" style="word-wrap: break-word;">Secret: <v-icon @click="showSecret" color="#fff" class="m-l m-t">{{this.show ? 'arrow_drop_up' : 'arrow_drop_down'}}</v-icon></h4>
                            <h4 class="c-white" v-if="show" style="word-wrap: break-word;">{{$store.state.winningItem.roundSecret}}</h4>
                        </v-flex>
                    </v-layout>
                </v-card-text>
                <v-card-actions class="m-t">
                    <v-flex xs12 class="text-xs-center">
                        <v-btn :loading="loading" @click="sellItem($store.state.winningItem)" class="sell-btn" flat>Sell this item for ${{$store.state.winningItem.item.price}}</v-btn>
                        <v-btn @click="$router.push('/verifyWinning')" class="verify-btn" flat>Verify Winning</v-btn>
                        <v-btn class="later-btn" outline flat @click="closeDialog">Later</v-btn>
                    </v-flex>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import Api from "@/services/Api";

export default {
  name: "DepositDialog",
  props: ["dialog"],
  data: function() {
    let data2 = this.$props.dialog;
    return {
      val: data2,
      loading: false,
      show: false
    };
  },
  watch: {
    dialog: function(newVal, oldVal) {
      this.val = newVal;
    }
  },
  methods: {
    closeDialog: function() {
      this.$emit("closeDialog");
    },
    sellItem: function(item){
      this.loading= true
      let $object = new Api('/user/trade/sell')
      $object.post(item).then(response =>{
          this.$store.commit('addUser', response.user)
          this.loading = false
          this.closeDialog()
      }).catch(()=>{
          this.loading = false
      })
    },
    showSecret: function(){
      this.show = !this.show
    }
  }
};
</script>
<style lang="scss">
@import '../assets/scss/variables.scss';

.win-dialog{
  background: $dark3 !important;
  padding: 2rem 3rem;

  .win-image{
    width: 150px;
    height: auto;
    margin-top: 3rem;
  }
  .sell-btn {
    background: $red !important;
    color: $white !important;
    float: right !important;
    margin-right: 1rem !important;
    border-radius: 50px;
    height: 45px;
  }
  .verify-btn {
    background: $green !important;
    color: $white !important;
    float: right !important;
    margin-right: 1rem !important;
    border-radius: 50px;
    height: 45px;
  }
  .later-btn {
    color: #ffffff !important;
    float: right !important;
    margin-right: 1rem !important;
    border-radius: 50px;
    width: 120px;
    height: 45px;
  }
}
</style>
