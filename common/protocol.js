/**
 * Created by nnnyy on 2018-11-24.
 */
const VueBus = {
    GoLoginPage: "GoLoginPage",
    Disconnect: "disconnect",
    EnterUser: "EnterUser",
    http: {
        CheckLogin: "/auth/checklogin",
        Login: "/auth/login"
    }
};

module.exports = VueBus;