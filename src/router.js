import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/pages/Home'
import CaseCreator from '@/pages/CaseCreator'
import CaseBrowser from '@/pages/CaseBrowser'
import FAQ from '@/pages/FAQ'
import TOS from '@/pages/TOS'
import About from '@/pages/About'
import Profile from '@/pages/Profile'
import ProfileWinnings from '@/components/Profile/Winnings'
import ProfileTrades from '@/components/Profile/Trades'
import Transactions from '@/components/Profile/Transactions'
import CaseDisplay from '@/components/CaseDisplay'
import SingleCase from '@/components/SingleCase'
import ItemsWon from '@/components/ItemsWon'
import Success from '@/components/Success'
import VerifyWinning from '@/components/VerifyWinning'
import UserVerification from '@/components/UserVerification'
import Failure from '@/components/Failure'
import Login from '@/components/Auth/Login'
import Register from '@/components/Auth/Register'



import store from './store'

function guard(to, from, next){
    if (store.state.userData) {
        next();
    } else {
        next('/login');
    }
}



Vue.use(Router);

export default new Router({
    scrollBehavior() {
        return { x: 0, y: 0 }
    },
    linkActiveClass: 'active',
    mode: 'history',
    routes: [
        { path: '/', component: Home },
        { path: '/login', component: Login },
        { path: '/register', component: Register },
        { path: '/caseBrowser', component: CaseBrowser },
        { path: '/caseCreator', component: CaseCreator, beforeEnter: guard },
        { path: '/case/:slug', component: SingleCase },
        { path: '/caseBrowser/:slug', component: CaseDisplay },
        { path: '/about', component: About },
        { path: '/faq', component: FAQ },
        { path: '/tos', component: TOS },
        { path: '/winnings', component: ItemsWon, beforeEnter: guard },
        { path: '/verifyWinning', component: VerifyWinning, beforeEnter: guard },
        { path: '/user/verification', component: UserVerification, beforeEnter: guard },
        { path: '/profile', component: Profile, beforeEnter: guard,
            children: [
                { path: 'cases', component: ProfileWinnings },
                { path: 'trades', component: ProfileTrades },
                { path: 'transactions', component: Transactions }
            ]
        },
        { path: '/payment/success', component: Success },
        { path: '/payment/failure', component: Failure },

    ]
})