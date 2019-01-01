<template>
    <div id="main">
        Login Page     
        <input type="text" v-model="iid"/>
        <input type="password" v-model="ipw"/>
        <button @click="onBtnLogin">로그인</button>
    </div>
</template>
<script>
    import G from './global'
    import P from '../common/protocol'
    import $ from 'jquery'    

    export default {
        data: function() {
            return {
                iid: '',
                ipw: ''
            }
        },
        components: {            
        },
        created: function() {            
        },
        methods: {
            onCheckLoginRet(data) {
                if( data.ret === 0 ) {
                    // 다시 메인으로
                    window.location.href = '/';
                }
            },
            onBtnLogin() {
                const id = this.iid;
                const pw = this.ipw;

                G.hpost(P.http.Login, {id: id, pw: pw}, this.onLoginRet);
            },
            onLoginRet(data) {                
                if( data.ret === 0 ) {
                    window.location.href = '/';
                }
            }
        },
        mounted: function() {
            G.hget(P.http.CheckLogin, this.onCheckLoginRet);
        }
    }
</script>

<style scoped>
</style>