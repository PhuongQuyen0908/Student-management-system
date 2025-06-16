import axios from '../setup/axios';

const getAllSchoolYear = async () => {
    return await axios.get('/api/year/read');
}

const createSchoolYear = async (data) => {
    return await axios.post('/api/year/create', data);
}

const getAllParameters = async () => {
    return await axios.get('/api/paramenter/read');
}

const updateParameter = async (parameterKey, data) => {
    return await axios.put(`/api/paramenter/update/${parameterKey}`, data);
}
export {
    getAllParameters,
    updateParameter,
    getAllSchoolYear,
    createSchoolYear
}