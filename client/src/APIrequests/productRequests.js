import axios from "axios";

var headers = {
    'Content-Type': 'application/json'
};
const burl = 'http://localhost:8800'    // basic url to which we append the rest of the routes;  we query the server listening on the port 8800 of the loopback


export default {
    createProduct: async function (productToAdd) {
        return axios.post(`${burl}/product/create`, 
        productToAdd,
        {
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
        ).then(res => res, err => {const errRes = {data: { text: err.response.data.text }}; return errRes})
    },
    deleteProduct: async function (productToDelete) {
        return axios.post(`${burl}/product/delete`,
        productToDelete,
        {
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
        ).then(res => res, err => {const errRes = {data: { text: err.response.data.text }}; return errRes})        
    },
    updateProduct: async function (productToUpdate) {
        return axios.post(`${burl}/product/update`,
        productToUpdate,
        {
            headers: { ...headers, 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
        ).then(res => res, err => {console.log(err); const errRes = {data: { text: err.response.data.text }}; return errRes})        
    }
}