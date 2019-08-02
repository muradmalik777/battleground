<template>
    <v-container class="login">
        <v-layout row justify-center align-center>
            <v-flex xs12 md5 lg4>
                <v-card class="login-card">
                    <h2 class="m-b-2">User Login</h2>
                    <v-form ref="form" id="loginForm" @keyup.native.enter="login">
                        <v-text-field
                        v-model="user.email"
                        type="email"
                        :rules="emailRules"
                        background-color="#303656"
                        label="Email"
                        outline
                        required
                        ></v-text-field>
                        <v-text-field
                        class="m-t m-b"
                        v-model="user.password"
                        type="password"
                        :rules="passwordRules"
                        background-color="#303656"
                        label="Password"
                        outline
                        required
                        ></v-text-field>
                        <v-btn @click="login" flat :loading="loading" color="#fff" right class="m-t login-btn">Login</v-btn>
                        <v-btn @click="login" flat outline :loading="loading" color="#fff" right class="m-t signup-btn m-l" to="/register">Create Account</v-btn>
                        <p><v-btn flat color="#fff" class="forgot-btn" :to="'/reset/password'">Forgot Password?</v-btn></p>
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
                email: "",
                password: ""
            },
            passwordRules: [v => !!v || "Password is required"],
            emailRules: [
                v => !!v || "E-mail is required",
                v => /.+@.+/.test(v) || "E-mail must be valid"
            ],
            loading: false
        }
    },
    methods: {
        login: function(){
            if(this.$refs.form.validate()){
                this.loading = true
                let $object = new Api('/user/login')
                $object.post(this.user).then(resp => {
                    this.$store.commit('addUser', resp)
                    this.$router.push("/")
                    this.loading = false
                }).catch((error) => {
                    this.showMessage(error.response.data.message)
                    this.loading = false
                })
            }
        }
    }
}
</script>
<style lang="scss">
@import "../../assets/scss/variables.scss";

.login{
    min-height: 70vh;
}
.login-card{
    background: transparent !important;
    min-height: 400px;
    padding: 10px;
    box-shadow: none !important;
    .login-btn{
        font-size: 16px;
        margin-left: 1.3rem;
        margin-bottom: 2rem;
        height: 55px;
        width: 150px;
        font-size: 16px !important;
        background: $gradient !important;
        text-transform: capitalize;
        border-radius: 50px;
        &:hover{
            box-shadow: 2px 2px 15px $black;
        }
    }
    .signup-btn{
        height: 53px;
        width: 150px;
        font-size: 16px;
        margin-bottom: 2rem;
        text-transform: capitalize;
    }
    .forgot-btn{
        height: 40px;
        width: 150px;
        font-size: 16px;
        font-weight: 500;
        margin: 0rem;
        text-transform: capitalize;
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
