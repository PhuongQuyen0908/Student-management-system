import { useState, useEffect } from "react";
import subjectGradeService from "../services/subjectGradeService";
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
    subjectGradeService.getTests().then(res => {
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
        const res = await subjectGradeService.getSubjectSummary({
          tenLop: filters.class,
          tenHocKy: filters.semester,
          tenNamHoc: filters.year,
          tenMonHoc: filters.subject,
        });

        if (res?.data?.EC === 0 && res?.data?.DT?.EC === -1) {
          setGrades([]);
          setError(res.data.DT.EM || "Lỗi khi truy vấn dữ liệu");
          return;
        }

        if (res?.data?.EC === 0 && res?.data?.DT) {
          const summary = res.data.DT;
          if (summary.DT && summary.DT.DiemChiTiet && Array.isArray(summary.DT.DiemChiTiet)) {
            setGrades(
              summary.DT.DiemChiTiet.map((item) => ({
                id: item.MaHocSinh,
                name: item.HoTen,
                diemTP: item.DiemTP || [],
                diemTB: item.DiemTB,
              }))
            );
          } else {
            setGrades([]);
            setError("Chưa có dữ liệu điểm cho lớp/môn học này");
          }
        } else {
          setGrades([]);
          setError(res?.data?.EM || "Không thể lấy dữ liệu điểm");
        }
      } catch (err) {
        console.error("Error fetching grades:", err);
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
        MaHocSinh: data.MaHocSinh,
        TenLop: filters.class,
        TenMonHoc: filters.subject,
        TenHocKy: filters.semester,
        TenNamHoc: filters.year,
        DiemTP: filledScores
      };

      const res = await subjectGradeService.addScore(payload);

      if (res?.data?.EC === 0) {
        toast.success("Thêm điểm thành công");
        closeAddModal();
        setRefreshFlag(f => f + 1);
      } else {
        toast.error(res?.data?.EM || "Không thể thêm điểm");
      }
    } catch (error) {
      console.error("Error adding score:", error);
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
        MaHocSinh: data.MaHocSinh,
        TenLop: filters.class,
        TenMonHoc: filters.subject,
        TenHocKy: filters.semester,
        TenNamHoc: filters.year,
        DiemTP: filledScores
      };

      const res = await subjectGradeService.editScore(payload);

      if (res?.data?.EC === 0) {
        toast.success("Cập nhật điểm thành công");
        closeEditModal();
        setRefreshFlag(f => f + 1);
      } else {
        toast.error(res?.data?.EM || "Không thể cập nhật điểm");
      }
    } catch (error) {
      console.error("Error updating score:", error);
      toast.error("Không thể kết nối đến máy chủ");
    }
  };

  const removeGrade = async (data) => {
    try {
      const payload = {
        MaHocSinh: data.MaHocSinh,
        TenLop: filters.class,
        TenMonHoc: filters.subject,
        TenHocKy: filters.semester,
        TenNamHoc: filters.year,
        DiemTP: data.DiemTP
      };

      const res = await subjectGradeService.deleteScore(payload);

      if (res?.data?.EC === 0) {
        toast.success("Xóa điểm thành công");
        setRefreshFlag(f => f + 1);
      } else {
        toast.error(res?.data?.EM || "Không thể xóa điểm");
      }
    } catch (error) {
      console.error("Error deleting score:", error);
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