import axios from '../setup/axios';

const getAllParameters = async () => {
    return await axios.get('/api/paramenter/read');
}

const updateParameter = async (parameterKey, data) => {
    return await axios.put(`/api/paramenter/update/${parameterKey}`, data);
}
export {
    getAllParameters,
    updateParameter,
}