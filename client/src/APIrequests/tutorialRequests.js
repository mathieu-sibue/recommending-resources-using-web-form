import axios from "axios";

var headers = {
    'Content-Type': 'application/json'
};
const burl = 'http://localhost:8800'    // basic url to which we append the rest of the routes;  we query the server listening on the port 8800 of the loopback


export default {
    createTutorial: async function (tutorialToAdd) {
        return axios.post(`${burl}/tutorial/create`, 
        tutorialToAdd,
        {
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
        ).then(res => res, err => {const errRes = {data: { text: err.response.data.text }}; return errRes})
    },
    deleteTutorial: async function (tutorialToDelete) {
        return axios.post(`${burl}/tutorial/delete`,
        tutorialToDelete,
        {
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
        ).then(res => res, err => {const errRes = {data: { text: err.response.data.text }}; return errRes})        
    },
    updateTutorial: async function (tutorialToUpdate) {
        return axios.post(`${burl}/tutorial/update`,
        tutorialToUpdate,
        {
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
        ).then(res => res, err => {console.log(err); const errRes = {data: { text: err.response.data.text }}; return errRes})        
    }
}