import axios from "axios";

var headers = {
    'Content-Type': 'application/json'
};
const burl = 'http://localhost:8800'    // basic url to which we append the rest of the routes;  we query the server listening on the port 8800 of the loopback


export default {
    createQuestion: async function (questionToAdd) {
        return axios.post(`${burl}/question/create`, 
        questionToAdd,
        {
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
        ).then(res => res, err => {const errRes = {data: { text: err.response.data.text }}; return errRes})
    },
    deleteQuestion: async function (questionToDelete, newQuestions) {
        return axios.post(`${burl}/question/delete`,
        {
            questionToDelete: questionToDelete,
            newQuestions: newQuestions
        },
        {
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
        ).then(res => res, err => {const errRes = {data: { text: err.response.data.text }}; return errRes})        
    },
    updateQuestions: async function (questionsToUpdate) {
        return axios.post(`${burl}/question/update`,
        {
            questionsToUpdate: questionsToUpdate
        },
        {
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
        ).then(res => res, err => {console.log(err); const errRes = {data: { text: err.response.data.text }}; return errRes})        
    }
}