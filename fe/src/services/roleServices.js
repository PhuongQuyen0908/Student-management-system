import axios from "../setup/axios";

const fetchGroup = () =>{
    return axios.get('api/group/read-for-admin');
}

const createGroup = (groupData) => {
    return axios.post("/api/group/create", groupData);
}


export {fetchGroup, createGroup};