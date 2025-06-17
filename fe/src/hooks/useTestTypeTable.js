import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import useModal from "./useModal";
import {
    getAllTests,
    getTestById,
    deleteTest,
    updateTest
} from "../services/testService";

const useTestTypeTable = () => {
    const updateModal = useModal();
    const deleteModal = useModal();

    const [testList, setTestList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);

    const fetchTestTypes = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAllTests();
            if (res?.data?.data) {
                setTestList(res.data.data);
            } else {
                toast.error(res?.data?.message || "Lỗi khi tải danh sách loại kiểm tra");
            }
        } catch (error) {
            setTestList([]);
            toast.error("Không thể kết nối đến máy chủ");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTestTypes();
    }, [fetchTestTypes]);


    const handleOpenUpdateModal = (testItem) => {
        setSelectedTest(testItem);
        updateModal.open();
    };

    const handleUpdateTest = async (updatedData) => {
        if (!updatedData) return;
        try {
            const id = updatedData.MaLoaiKiemTra;
            const testData = {
                TenLoaiKiemTra: updatedData.TenLoaiKiemTra,
                HeSo: updatedData.HeSo,
            };
            const res = await updateTest(id, testData);
            if (res?.status === 200 && res?.data?.data) {
                toast.success(res.data.message || "Cập nhật thành công");
                await fetchTestTypes();
                updateModal.close();
                setSelectedTest(null);
            } else {
                toast.error(res?.data?.message || "Không thể cập nhật loại kiểm tra");
            }
            return res;
        } catch (error) {
            toast.error("Không thể kết nối đến máy chủ");
            return { data: null, message: "Không thể kết nối đến máy chủ" };
        }
    };


    const handleOpenDeleteModal = (testItem) => {
        setSelectedTest(testItem);
        deleteModal.open();
    };

    const handleDeleteTest = async (id) => {
        if (!id) return;
        try {
            const res = await deleteTest(id);
            if (res?.status === 200) {
                toast.success(res.data.message || "Xóa thành công");
                await fetchTestTypes();
                deleteModal.close();
                setSelectedTest(null);
            } else {
                toast.error(res?.data?.message || "Không thể xóa loại kiểm tra");
            }
            return res;
        } catch (error) {
            toast.error("Không thể kết nối đến máy chủ");
            return { data: null, message: "Không thể kết nối đến máy chủ" };
        }
    };


    return {
        testList,
        selectedTest,
        loading,
        updateModal,
        deleteModal,
        handleOpenUpdateModal,
        handleUpdateTest,
        handleOpenDeleteModal,
        handleDeleteTest,
        fetchTestTypes,
    };
};

export default useTestTypeTable;
