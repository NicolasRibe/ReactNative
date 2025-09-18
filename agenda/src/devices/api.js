import axios from "axios";

const api = axios.create({
    timeout:3000
});

export default api;