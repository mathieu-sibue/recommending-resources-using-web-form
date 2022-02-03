import axios from "axios";

var headers = {
    'Content-Type': 'application/json'
};
const burl = 'http://localhost:8800'    // basic url to which we append the rest of the routes;  we query the server listening on the port 8800 of the loopback


export default {
    signup: async function (userInfo) {
        return axios.post(`${burl}/user/signup`, 
        userInfo, {
            headers: headers
        }).then(res => res, err => {const errRes = {data: err.response.data.text}; return errRes})
    },
    
    login: async function (userInfo) {
        return axios.post(`${burl}/user/login`,
        userInfo, {
            headers: headers
        }).then(res => res, err => {const errRes = {data: err.response.data.text}; return errRes})
    },

    logout: function () {
        localStorage.clear();
    },

    getUserInfo: async function (token){
        return axios.get(`${burl}/user/getuser`, {
            params: { token: token },
            headers: headers
        }).then(res => res.data, err => null)
    },

    editProfile: async function (newUserInfo) {
        return axios.post(`${burl}/user/editprofile`,
        newUserInfo, {
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(res => res, err => {const errRes = {data: err.response.data.text}; return errRes})
    }
}