<template>
    <div id="main" v-if="showInfo">
        <title-canvas></title-canvas>
    </div>
</template>
<script>
    import G from './global'
    import P from '../common/protocol'
    import $ from 'jquery'   
    import titleCanvas from './components/titlecanvas.vue' 

    export default {
        data: function() {
            return {
                showInfo: false
            }
        },
        components: { 
            'title-canvas': titleCanvas           
        },
        created: function() {            
        },
        methods: {
            onCheckLoginRet(packet) {
                if( packet.ret === 0 ) {
                    G.connectSocket();
                    G.on(P.EnterUser, this.onEnterUser);
                }
                else {
                    window.location.href = '/login/'
                }
            },
            onEnterUser(packet) {
                this.showInfo = true;
            }
        },
        mounted: function() {            
            G.hget(P.http.CheckLogin, this.onCheckLoginRet);
        }
    }
</script>

<style scoped>
</style>