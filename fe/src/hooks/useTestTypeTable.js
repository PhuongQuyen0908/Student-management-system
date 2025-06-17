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
            if (res?.data?.EC === 0) {
                setTestList(res.data.DT || []);
            } else {
                setTestList([]);
                toast.error(res?.data?.EM || "Lỗi khi tải danh sách loại kiểm tra");
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
            };
            const res = await updateTest(id, testData);
            if (res?.data?.EC === 0) {
                toast.success("Cập nhật thành công");
                await fetchTestTypes();
                updateModal.close();
                setSelectedTest(null);
            } else {
                toast.error(res?.data?.EM || "Không thể cập nhật loại kiểm tra");
            }
            return res;
        } catch (error) {
            toast.error("Không thể kết nối đến máy chủ");
            return { data: { EC: -1, EM: "Không thể kết nối đến máy chủ" } };
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
            if (res?.data?.EC === 0) {
                toast.success("Xóa thành công");
                await fetchTestTypes();
                deleteModal.close();
                setSelectedTest(null);
            } else {
                toast.error(res?.data?.EM || "Không thể xóa loại kiểm tra");
            }
            return res;
        } catch (error) {
            toast.error("Không thể kết nối đến máy chủ");
            return { data: { EC: -1, EM: "Không thể kết nối đến máy chủ" } };
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
