<template>
    <v-container grid-list-xl class="verify-winning spacing" mt-4>
        <v-layout row wrap justify-center>
            <v-flex xs12 md7 lg5 class="verify-form text-xs-left">
                <h2 class="uppercase m-b-2">verify your result</h2>
                <v-form ref="verifyForm">
                    <label>Case</label>
                    <v-text-field color="#fff" v-model="box.name" background-color="#252A4472" readonly :rules="dataRules" required></v-text-field>
                    <label>Client Hash</label>
                    <v-text-field color="#fff" v-model="verify.clientHash" background-color="#252A4472" :rules="dataRules" required></v-text-field>
                    <label>Round Secret</label>
                    <v-textarea color="#fff" background-color="#252A4472" no-resize :rules="dataRules" v-model="verify.roundSecret"></v-textarea>

                    <v-btn :loading="loading" @click="verifyWinning" class="verify-btn" flat>Verify</v-btn>
                </v-form>
            </v-flex>
            <v-flex xs12 md5 lg4>
                <v-card class="m-t-6 result">
                    <v-card-text>
                        <v-layout row>
                            <v-flex xs12>
                                <h3 class="m-b-2 uppercase">Results</h3>
                                <h4 class="c-white m-b">Original Ticket Number: {{$store.state.winningItem.ticketNumber}}</h4>
                                <h4 class="c-white m-b">Item Won: <br> {{$store.state.winningItem.item.marketHashName}}</h4>

                                <h3 class="m-b-2 m-t-2 uppercase">Ticket Ranges</h3>
                                <h4 class="c-white m-b" v-if="this.winningTicket">Winning Ticket Number: {{winningTicket}}</h4>
                                <h4 v-for="(item, i) in result" :key="i" class="c-white m-b">{{item.firstTicket}} - {{item.lastTicket}} : {{item.name}}</h4>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import Api from "@/services/Api";

export default {
  name: "VerifyWinning",
  data: function() {
    let data = this.$store.state.winningItem;
    let data2 = this.$store.state.lastCaseOpened
    return {
      verify: data,
      box: data2,
      result: [],
      winningTicket: null,
      loading: false,
      dataRules: [v => !!v || "The input is required"]
    };
  },
  methods: {
    verifyWinning: function() {
      this.loading = true;
      let $object = new Api("/winning/verify");
      $object.post(this.verify).then(resp => {
          this.winningTicket = resp.roll
          this.result = resp.tickets
          this.loading = false;
      }).catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>
<style lang="scss">
@import "../assets/scss/variables.scss";

.verify-winning {
  min-height: 90vh;

  .v-text-field__slot {
    padding: 0.5rem 1rem;
    textarea {
      color: #fff !important;
    }
  }
  label {
    text-transform: capitalize;
  }
  .verify-btn {
    background: $green-gradient !important;
    color: $white !important;
    width: 120px;
    height: 45px;
    margin: 0;
    margin-top: 1rem;
    float: left !important;
    &:hover{
      box-shadow: 2px 2px 15px $black;
    }
  }
  .result {
    margin-left: 50px;
    margin-top: 7rem;
    min-height: 340px;
    background-color: $dark3;

    h4{
        color: #dddddd;
    }
  }
}
</style>
