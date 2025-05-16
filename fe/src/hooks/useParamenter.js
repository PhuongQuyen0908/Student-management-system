import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { updateParameter} from '../services/paramenterService';
import { getAllParameters } from '../services/paramenterService';

const useParamenterTable = () => {
    // Lấy ra danh sách tham số
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(false);
    const [parameterList, setParameterList] = useState([]);

    // Lấy danh sách tham số
    const fetchParamenterList = async () => {
        setLoading(true);
        try {
            const res = await getAllParameters();
            if (res?.data?.EC === 0) {
                setParameterList(res.data.DT || []);
            } else {
                setParameterList([]);
                toast.error(res?.data?.EM || "Lỗi khi tải danh sách tham số");
            }
        } catch (error) {
            console.log(error);
            setParameterList([]);
            toast.error("Không thể kết nối đến máy chủ");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchParamenterList();
    }, []);

    // Cập nhật tham số
    const handleUpdateParamenter = async (parameterKey, data) => {
        setLoading(true);
        try {
            const res = await updateParameter(parameterKey, data);
            console.log(res);
            if (res?.data?.EC === 0) {
                console.log(res);
                toast.success(res?.data?.EM || "Cập nhật tham số thành công");
            } else {
                toast.error(res?.data?.EM || "Cập nhật tham số thất bại");
            }
        } catch (error) {
            console.log(error);
            toast.error("Không thể kết nối đến máy chủ");
        } finally {
            setLoading(false);
        }
    }

    return {
        parameterList,
        handleUpdateParamenter,
    };
};

export default useParamenterTable;