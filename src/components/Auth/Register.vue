<template>
    <v-container class="register">
        <v-layout row justify-center>
            <v-flex xs12 md5 lg4>
                <v-card class="register-card">
                    <h2 class="m-b-2">User Registration</h2>
                    <v-form ref="form" @keyup.native.enter="submit">
                        <v-text-field
                        v-model="user.user_name"
                        label="Full Name"
                        type="text"
                        :rules="nameRules"
                        background-color="#303656"
                        outline
                        required
                        ></v-text-field>
                        <v-text-field
                        v-model="user.email"
                        label="Email"
                        type="email"
                        :rules="emailRules"
                        background-color="#303656"
                        outline
                        required
                        ></v-text-field>
                        <v-text-field
                        v-model="user.password"
                        type="password"
                        label="Password"
                        :rules="passwordRules"
                        background-color="#303656"
                        outline
                        required
                        ></v-text-field>
                        <v-text-field
                        @change="matchPassword"
                        v-model="user.confirm_password"
                        type="password"
                        label="Confirm Password"
                        :rules="confirmPasswordRules"
                        background-color="#303656"
                        outline
                        required
                        ></v-text-field>
                        <v-btn @click="submit" dark :loading="loading" color="#fff" right class="m-t signup-btn">Sign Up</v-btn>
                        <p class="c-white already">Already have an account?<v-btn flat class="login-btn capitalize" :to="'/login'">Login</v-btn></p>
                    </v-form>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import Api from '@/services/Api'

export default {
    name: "Login",
    data: function(){
        return{
            user: {
                user_name: "",
                email: "",
                password: ""
            },
            passwordRules: [v => !!v || "The input is required"],
            confirmPasswordRules: [v => !!v || "The input is required", v => v === this.user.password || 'Passwords do not match'],
            nameRules: [v => !!v || "The input is required"],
            emailRules: [
                v => !!v || "E-mail is required",
                v => /.+@.+/.test(v) || "E-mail must be valid"
            ],
            loading: false
        }
    },
    methods: {
        submit: function(){
            if(this.$refs.form.validate()){
                this.loading = true
                let $object = new Api('/user/register')
                $object.post(this.user).then(resp => {
                    this.$store.commit('addUser', resp)
                    this.$router.push("/")
                    this.loading = false
                }).catch((error) => {
                    this.loading = false
                    this.showMessage(error.response.data.message)
                })
            }
        },
        matchPassword: function(){
            this
        }
    }
}
</script>
<style lang="scss">
@import "../../assets/scss/variables.scss";

.register{
    min-height: 80vh;
}
.register-card{
    background: transparent !important;
    min-height: 400px;
    padding: 10px;
    box-shadow: none !important;
    .signup-btn{
        font-size: 16px;
        margin-left: 1.3rem;
        margin-bottom: 2rem;
        height: 55px;
        width: 150px;
        background: $gradient !important;
        text-transform: capitalize;
        &:hover{
            background: transparent !important;
        }
    }
    .login-btn{
        font-size: 18px;
        margin-bottom: .7rem;
        color: $red;
    }
    .already{
        width: calc(100%-200px);
        float: right;
        margin-top: 2rem;
    }
    .v-text-field{
        margin-bottom: .5rem;
        label{
            font-size: 14px;
            color: $white;
        }
        input{
            padding: 1.5rem 0;
            font-size: 14px;
            color: $white;
        }
    }
}
</style>
