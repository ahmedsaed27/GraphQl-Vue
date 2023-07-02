import axios from "axios";
import {AUTH_TOKEN, apolloClient, onLogin, onLogout} from "@/vue-apollo";
import LOGGED_IN_USER from "@/graphql/authUser.gql";

function initialState() {
    return {
        token: null,
        user: {},
    };
}

const LOGIN_URL = 'http://127.0.0.1:8000' + "/api/sanctum/token";
const LOGOUT_URL = 'http://127.0.0.1:8000' + "/api/sanctum/token/destroy";

const getters = {
    isAuthenticated: (state) => !!state.token,
    user: (state) => state.user,
};

const actions = {
    async login({commit, dispatch}, authDetails) {
        return new Promise((resolve, reject) => {
            axios
                .post(LOGIN_URL, {
                    email: authDetails.email,
                    password: authDetails.password,
                    device_name: navigator.userAgent,
                })
                .then(async (response) => {
                    let token = response.data;
                    await onLogin(apolloClient, token);
                    commit("setToken", token);
                    dispatch("setUser");
                    resolve(response);
                })
                .catch((error) => reject(error));
        });
    },

    async logout({commit, state}) {
        return new Promise((resolve) => {
            console.log(state.token);
            axios
                .post(
                    LOGOUT_URL,
                    {},
                    {
                        headers: {Authorization: "Bearer " + state.token},
                    }
                )
                .then(async () => {
                    await onLogout(apolloClient);
                    commit("setToken", null);
                    commit("loginUser", {});
                });
            resolve();
        });
    },

    async setUser({commit}) {
        const {data} = await apolloClient.query({query: LOGGED_IN_USER});
        commit("loginUser", data.me);
    },

    async attemptAuthentication({commit, dispatch}) {
        let token = localStorage.getItem(AUTH_TOKEN);
        
        if(token && token != null || ''){
            commit("setToken", token);
            dispatch("setUser");
        }

    },
};

const mutations = {
    setToken(state, token) {
        state.token = token;
    },
    loginUser(state, user) {
        state.user = {...user};
    },
};

export default {
    namespaced: true,
    state: initialState,
    getters,
    actions,
    mutations,
};