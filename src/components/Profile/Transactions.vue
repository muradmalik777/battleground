<template>
    <v-container fluid grid-list-xs class="transaction spacing">
        <v-layout row wrap justify-start>
            <v-flex xs12>
                <h2 class="uppercase m-b-2">transactions</h2>
                <v-data-table
                    :headers="headers"
                    :items="data"
                    hide-actions
                    class="trades-table">
                    <template v-slot:items="props">
                        <td>{{ props.item.time | moment("from", "now") }}</td>
                        <td>{{ props.item.case._id }}</td>
                        <td>{{ props.item.case.name }}</td>
                        <td>{{ props.item.case.price }}</td>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import Api from '@/services/Api'
export default {
    name: 'transactions',
    data: function(){
        return{
            data: [],
            headers: [
                {
                    text: 'Time',
                    value: 'time',
                    align: 'left',
                    sortable: false,
                    width: '15%'
                },
                {
                    text: 'Case ID',
                    value: 'case_id',
                    align: 'left',
                    sortable: false,
                    width: '25%'
                },
                {
                    text: 'Case Name',
                    value: 'case_name',
                    align: 'left',
                    sortable: false,
                    width: '20%'
                },
                {
                    text: 'Case Price',
                    value: 'case_price',
                    align: 'left',
                    sortable: false,
                    width: '15%'
                },
            ],
        }
    },
    mounted: function(){
        this.getTransactions()
    },
    methods: {
        getTransactions: function(){
            let $object = new Api('/purchases/user')
            let params = { id: this.$store.state.userData._id, p:this.currentPage }
            $object.getList(params).then(response => {
                this.data = response.items
            })
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
