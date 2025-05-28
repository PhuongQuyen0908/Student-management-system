import { useState, useEffect } from "react";
import reportService from "../services/subjectGradeService";
import { toast } from "react-toastify";

const useSubjectGradeTable = (filters) => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentTarget, setCurrentTarget] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [testTypes, setTestTypes] = useState([]);

  // Fetch test types from DB
  useEffect(() => {
    reportService.getTests().then(res => {
      if (Array.isArray(res.data?.data)) setTestTypes(res.data.data);
    });
  }, []);

  useEffect(() => {
    if (!filters || !filters.class || !filters.semester || !filters.year || !filters.subject) {
      setGrades([]);
      setError("Vui lòng chọn đầy đủ bộ lọc để xem bảng điểm.");
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await reportService.getSubjectSummary({
          tenLop: filters.class,
          tenHocKy: filters.semester,
          tenNamHoc: filters.year,
          tenMonHoc: filters.subject,
        });
        const diemChiTiet = res?.data?.DT?.DT?.DiemChiTiet;
        if (res?.data?.EC === 0 && Array.isArray(diemChiTiet)) {
          setGrades(
            diemChiTiet.map((item) => ({
              name: item.HoTen,
              diemTP: item.DiemTP,
              diemTB: item.DiemTB,
            }))
          );
        } else {
          setGrades([]);
          setError(res?.data?.EM || "Không có dữ liệu điểm");
        }
      } catch (err) {
        setGrades([]);
        setError("Không thể kết nối đến máy chủ");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters, refreshFlag, testTypes]);

  const openEditModal = (student) => {
    setCurrentTarget(student);
    setEditModalOpen(true);
  };
  const closeEditModal = () => {
    setEditModalOpen(false);
    setCurrentTarget(null);
  };
  const openAddModal = (student) => {
    setCurrentTarget(student);
    setAddModalOpen(true);
  };
  const closeAddModal = () => {
    setAddModalOpen(false);
    setCurrentTarget(null);
  };
  const openDeleteModal = (student) => {
    setCurrentTarget(student);
    setDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setCurrentTarget(null);
  };

  // Dynamic addGrade
  const addGrade = async (data) => {
    try {
      const filledScores = testTypes
        .filter(type => data.DiemTP?.[type.TenLoaiKiemTra] !== "" && data.DiemTP?.[type.TenLoaiKiemTra] !== null && data.DiemTP?.[type.TenLoaiKiemTra] !== undefined)
        .map(type => ({
          LoaiKiemTra: type.TenLoaiKiemTra,
          Diem: data.DiemTP[type.TenLoaiKiemTra]
        }));
      const payload = {
        HoTen: data.HoTen,
        TenLop: filters.class,
        TenMonHoc: filters.subject,
        TenHocKy: filters.semester,
        TenNamHoc: filters.year,
        DiemTP: filledScores
      };
      const res = await reportService.addScore(payload);
      if (res?.data?.EC === 0) {
        toast.success("Thêm điểm thành công");
        closeAddModal();
        setRefreshFlag(f => f + 1);
      } else {
        toast.error(res?.data?.EM || "Không thể thêm điểm");
      }
    } catch {
      toast.error("Không thể kết nối đến máy chủ");
    }
  };

  // Dynamic updateGrade
  const updateGrade = async (data) => {
    try {
      const filledScores = testTypes
        .filter(type => data.DiemTP?.find(d => d.LoaiKiemTra === type.TenLoaiKiemTra && d.Diemmoi !== "" && d.Diemmoi !== null && d.Diemmoi !== undefined))
        .map(type => ({
          LoaiKiemTra: type.TenLoaiKiemTra,
          Diemmoi: data.DiemTP.find(d => d.LoaiKiemTra === type.TenLoaiKiemTra)?.Diemmoi
        }));
      const payload = {
        HoTen: data.HoTen || data.name,
        TenLop: filters.class,
        TenMonHoc: filters.subject,
        TenHocKy: filters.semester,
        TenNamHoc: filters.year,
        DiemTP: filledScores
      };
      const res = await reportService.editScore(payload);
      if (res?.data?.EC === 0) {
        toast.success("Cập nhật điểm thành công");
        closeEditModal();
        setRefreshFlag(f => f + 1);
      } else {
        toast.error(res?.data?.EM || "Không thể cập nhật điểm");
      }
    } catch {
      toast.error("Không thể kết nối đến máy chủ");
    }
  };

  const removeGrade = async (data) => {
    try {
      const res = await reportService.deleteScore(data);
      if (res?.data?.EC === 0) {
        toast.success("Xóa điểm thành công");
        setRefreshFlag(f => f + 1);
      } else {
        toast.error(res?.data?.EM || "Không thể xóa điểm");
      }
    } catch {
      toast.error("Không thể kết nối đến máy chủ");
    }
  };

  return {
    grades,
    loading,
    error,
    currentTarget,
    editModalOpen,
    addModalOpen,
    deleteModalOpen,
    openEditModal,
    closeEditModal,
    openAddModal,
    closeAddModal,
    openDeleteModal,
    closeDeleteModal,
    addGrade,
    updateGrade,
    removeGrade,
    testTypes
  };
};

export default useSubjectGradeTable;