import axios from "axios";

var headers = {
    'Content-Type': 'application/json'
};
const burl = 'http://localhost:8800'    // basic url to which we append the rest of the routes;  we query the server listening on the port 8800 of the loopback


export default {
    getAllRessources: async function () {
        return axios.get(`${burl}/ressource/getall`, {
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
        ).then(res => res.data.ressources)
    },
    getAllResults: async function (themes) {
        return axios.get(`${burl}/ressource/getallresults`, {
            params: { themes },
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
        ).then(res => res.data.results)
    },
    deleteUserResponse: async function (userResponseToDelete) {
        return axios.post(`${burl}/ressource/deleteuserresponse`, 
        userResponseToDelete, 
        {
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
        ).then(res => res, err => {const errRes = {data: { text: err.response.data.text }}; return errRes})   
    }     
}

