<template>
    <div class="text-xs-center">
        <v-dialog
        v-model="val"
        persistent
        width="800">

            <v-card class="deposit-funds">
                <v-form ref="form">
                    <v-card-title class="headline" primary-title>Deposit Funds to your Account</v-card-title>
                    <v-card-text>
                        <v-flex xs12>
                            <h3 class="m-b">Select Amount</h3>
                        </v-flex>
                        <v-flex xs12>
                            <v-btn @click="deposit.amount = 10" :class="{'active-btn': deposit.amount == 10}" class="amount-btn">$10</v-btn>
                            <v-btn @click="deposit.amount = 20" :class="{'active-btn': deposit.amount == 20}" class="amount-btn">$20</v-btn>
                            <v-btn @click="deposit.amount = 50" :class="{'active-btn': deposit.amount == 50}" class="amount-btn">$50</v-btn>
                            <v-btn @click="deposit.amount = 100" :class="{'active-btn': deposit.amount == 100}" class="amount-btn">$100</v-btn>
                            <v-btn @click="deposit.amount = 200" :class="{'active-btn': deposit.amount == 200}" class="amount-btn">$200</v-btn>
                            <v-btn @click="deposit.amount = 500" :class="{'active-btn': deposit.amount == 500}" class="amount-btn">$500</v-btn>
                            <v-btn @click="deposit.amount = 1000" :class="{'active-btn': deposit.amount == 1000}" class="amount-btn">$1000</v-btn>
                        </v-flex>
                        <v-flex xs12 mt-4>
                            <v-text-field
                            v-if="custom"
                            v-model="deposit.amount"
                            type="text"
                            :rules="fieldRules"
                            background-color="#1F2034"
                            outline
                            required
                            ></v-text-field>
                        </v-flex>
                    </v-card-text>
                    <v-card-actions>
                        <v-flex xs12 class="text-xs-center">
                            <v-btn class="confirm-btn" flat @click="confirmDeposit" :loading="loading">Confirm</v-btn>
                            <v-btn class="close-btn" flat @click="closeDialog">Close</v-btn>
                            <v-btn class="custom-btn" flat @click="custom = !custom">Custom Value</v-btn>
                            <v-btn class="bitcoin-btn" flat @click="confirmDeposit" :loading="loading">Pay With Bitcoin</v-btn>
                        </v-flex>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import Api from '@/services/Api'

export default {
    name: "DepositDialog",
    props: ["dialog"],
    data: function(){
        let data2 = this.$props.dialog
        let data = this.$store.state.userData.email
        return{
            val: data2,
            email: data,
            deposit: {
                amount: 10,
            },
            fieldRules: [v => !!v || "field is required"],
            emailRules: [
                v => !!v || "E-mail is required",
                v => /.+@.+/.test(v) || "E-mail must be valid"
            ],
            loading: false,
            custom: false
        }
    },
    watch: {
        dialog: function(newVal, oldVal){
            this.val = newVal
        }
    },
    methods: {
        closeDialog: function(){
            this.$emit('close')
        },
        confirmDeposit: function(){
            this.loading = true
            let $object = new Api("/deposit")
            this.deposit.amount = parseFloat(this.deposit.amount).toFixed(2)
            let data = {
                user: this.$store.state.userData,
                deposit: this.deposit
            }
            $object.post(data).then(resp => {
                window.location.replace(resp.payment_url)
            }).catch(()=>{
                this.loading = false
            })
        }
    }
}
</script>
<style lang="scss">
@import "../assets/scss/variables.scss";

.v-card.deposit-funds{
    padding: 20px;
    background: $darkest;

    .confirm-btn{
        background: $gradient !important;
        color: $white !important;
        border-radius: 50px;
        height: 50px;
        width: 130px;
        font-weight: 600;
        float: left !important;
        margin: 2rem 1rem 0 1rem;
        &:hover{
            background: transparent !important;
        }
    }
    .bitcoin-btn{
        color: $orange !important;
        float: right !important;
        border-radius: 50px;
        height: 50px;
        margin-top: 2rem;
        font-weight: 600;
        font-size: 16px;
    }
    .close-btn{
        color: #ffffff !important;
        height: 50px;
        float: left !important;
        border-radius: 50px;
        margin-top: 2rem;
    }
    .custom-btn{
        color: $red !important;
        float: right !important;
        border-radius: 50px;
        height: 50px;
        margin-top: 2rem;
        font-weight: 600;
        font-size: 16px;
    }
    .amount-btn{
        background: $green-gradient !important;
        color: $dark2 !important;
        font-size: 18px;
        border-radius: 50px;
        height: 40px;
        &:hover{
            background: transparent !important;
            color: $white !important;
        }
    }
    .active-btn{
        background: $gradient !important;
        color: $white !important;
        font-weight: 600;
        font-size: 18px;
        &:hover{
            background: $gradient !important;
        }
    }
    .v-text-field{
        margin-bottom: 0;
        input{
            padding: 1.5rem 0;
            font-size: 14px;
            color: $white;
            margin: .5rem;
        }
    }
}
</style>
