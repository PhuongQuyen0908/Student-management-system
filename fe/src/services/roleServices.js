import axios from "../setup/axios";

const fetchGroup = (search="" ,sortField ,sortOrder) =>{
    return axios.get('api/group/read-for-admin',{
        params: {
            search,
            sortField,
            sortOrder,

        },
    });
}

const createGroup = (groupData) => {
    return axios.post("/api/group/create", groupData);
}

const fetchAllPermissions = () => {
    return axios.get('api/permission/read');
}

const fetchAllPermissionsByGroup = (groupId) => {
    return axios.get(`api/permission/by-group/${groupId}`);
}

const assignGroupPermissions = (data) => {
    return axios.post(`/api/permission/assign`,{data:data});
}
export {fetchGroup, createGroup , fetchAllPermissions , fetchAllPermissionsByGroup,assignGroupPermissions};