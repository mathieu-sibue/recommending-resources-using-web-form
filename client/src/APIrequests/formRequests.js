import axios from "axios";

var headers = {
    'Content-Type': 'application/json'
};
const burl = 'http://localhost:8800'    // basic url to which we append the rest of the routes;  we query the server listening on the port 8800 of the loopback


export default {
    getUserResponses: async function (userId) {
        return axios.get(`${burl}/response/getprevres`, {
            params: userId,
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
        )
    },
    updateUserResponses: async function (userId, questAndResNew) {
        return axios.post(`${burl}/response/updateres`, {
            userId, 
            questAndResNew
        },
        {
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
        ).then(res => null)
    },
    updateUserResAndComputeResults: async function (userId, questAndRes, themes) {
        return axios.post(`${burl}/response/computeresults`, {
            userId,
            questAndRes,
            themes
        },
        {
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
        )
    }
}