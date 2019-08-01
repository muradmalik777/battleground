<template>
    <v-container class="free-credits spacing" mt-1>
        <v-layout row wrap>
            <v-flex xs9 class="credit">
                <div class="left">
                    <h1 class="capitalize">collect free credits <br>every 24 hours</h1>
                    <v-btn class="learn-btn">learn more</v-btn>
                </div>
                <div class="right">
                    <v-img :src="require('@/assets/imgs/newcase.svg')" class="case-image"></v-img>
                </div>
            </v-flex>
            <v-flex xs3 class="tags">
                <div class="tag">
                    <div class="left">
                        <v-img :src="require('@/assets/imgs/console.svg')" class="tag-image"></v-img>
                    </div>
                    <div class="right">
                        <h4 class="tag-count">68274</h4>
                        <h4 class="uppercase">players</h4>
                    </div>             
                </div>
                <div class="tag">
                    <div class="left">
                        <v-img :src="require('@/assets/imgs/open-box.svg')" class="tag-image"></v-img>
                    </div>
                    <div class="right">
                        <h4 class="tag-count">68274</h4>
                        <h4 class="uppercase">today opened</h4>
                    </div>             
                </div>
                <div class="tag">
                    <div class="left">
                        <v-img :src="require('@/assets/imgs/opened-package.svg')" class="tag-image"></v-img>
                    </div>
                    <div class="right">
                        <h4 class="tag-count">68274</h4>
                        <h4 class="uppercase">total opened</h4>
                    </div>             
                </div>
                <div class="tag">
                    <div class="left">
                        <v-img :src="require('@/assets/imgs/medal.svg')" class="tag-image"></v-img>
                    </div>
                    <div class="right">
                        <h4 class="tag-count">68274</h4>
                        <h4 class="uppercase">rewards</h4>
                    </div>             
                </div>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
export default {
    name: 'FreeCredits',
    data: function(){
        return{

        }
    }
}
</script>
<style lang="scss">
@import "../assets/scss/variables.scss";

.free-credits{
    max-width: 100%;
    margin: 0 auto;
    .credit{
        height: 430px;
        background-image: url('../assets/imgs/credit-back.svg');
        background-size: cover;

        .left{
            width: 70%;
            padding: 2rem 1rem 2rem 5rem;

            h1{
                font-size: 70px;
                margin: 2rem 0;
            }
            .learn-btn{
                color: $white;
                width: 230px;
                height: 50px;
                margin: 0;
                font-size: 16px;
                background-image: $gradient !important;
                border-radius: 50px;
                border: none;
                &:hover{
                    box-shadow: 2px 2px 15px $black;
                }
            }
        }
        .right{
            width: 30%;
            .case-image{
                display: block;
                margin: 5rem auto;
                width: 370px;
                height: auto;
                transition: width 0.35s;
            }
        }
    }
    .tags{
        padding: 2rem 1rem 2rem 3rem;
        .tag{
            width: 100%;
            height: 90px;
            .left{
                width: 35%;
                .tag-image{
                    width: 35px;
                    height: auto;
                    margin: .8rem auto;
                }
            }
            .right{
                width: 65%;
                .tag-count{
                    font-size: 18px;
                    color: $orange;
                    margin: .5rem 0;
                }
            }
        }
    }
}

@media only screen and (min-width: 1366px) and (max-width: 1440px) {
    .free-credits{
        .credit{
            height: 380px;
            padding: 2rem 2rem;
            .left{
                h1{
                    font-size: 52px;
                }
            }
            .right{
                .case-image{
                    width: 250px;
                }
            }
        }
    }
}


@media only screen and (min-width: 1921px) and (max-width: 2560px) {
    .free-credits{
        .credit{
            height: 450px;
            padding: 2rem 5rem;
            .left{
                h1{
                    font-size: 80px;
                }
            }
            .right{
                .case-image{
                    width: 350px;
                }
            }
        }
        .tags{
            padding: 1.5rem 1rem 1.5rem 3rem;
            .tag{
                height: 110px;
                .left{
                    width: 35%;
                    .tag-image{
                        width: 50px;
                    }
                }
                .right{
                    width: 65%;
                    .tag-count{
                        font-size: 20px;
                    }
                }
            }
        }
    }
}
</style>
