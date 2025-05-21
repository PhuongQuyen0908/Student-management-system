/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import reportService from "../services/reportService";
import { toast } from "react-toastify";

export const getFinalTestType = (semester) => {
  if (!semester) return "Thi học kỳ I";
  if (semester.trim().match(/2|II/i)) return "Thi học kỳ II";
  return "Thi học kỳ I";
};

const useSubjectGradeTable = (filters) => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [currentEditGrade, setCurrentEditGrade] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(0);

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
              test15: item.DiemTP?.find(d => d.LoaiKiemTra === "Kiểm tra 15 phút")?.Diem ?? "",
              test1period: item.DiemTP?.find(d => d.LoaiKiemTra === "Kiểm tra 1 tiết")?.Diem ?? "",
              final: item.DiemTP?.find(d => d.LoaiKiemTra === getFinalTestType(filters.semester))?.Diem ?? "",
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
  }, [filters, refreshFlag]);

  const openEditModal = (grade) => {
    setCurrentEditGrade(grade);
    setEditModalOpen(true);
  };
  const closeEditModal = () => {
    setEditModalOpen(false);
    setCurrentEditGrade(null);
  };
  const openAddModal = (student) => {
    setSelectedStudent(student);
    setAddModalOpen(true);
  };
  const closeAddModal = () => {
    setAddModalOpen(false);
    setSelectedStudent(null);
  };

  // Always send full context and correct test type names
  const addGrade = async (data) => {
    try {
      const payload = {
        HoTen: data.HoTen,
        TenLop: filters.class,
        TenMonHoc: filters.subject,
        TenHocKy: filters.semester,
        TenNamHoc: filters.year,
        DiemTP: [
          { LoaiKiemTra: "Kiểm tra 15 phút", Diem: data.DiemTP?.find(d => d.LoaiKiemTra === "Kiểm tra 15 phút")?.Diem ?? "" },
          { LoaiKiemTra: "Kiểm tra 1 tiết", Diem: data.DiemTP?.find(d => d.LoaiKiemTra === "Kiểm tra 1 tiết")?.Diem ?? "" },
          { LoaiKiemTra: getFinalTestType(filters.semester), Diem: data.DiemTP?.find(d => d.LoaiKiemTra === "Thi học kỳ" || d.LoaiKiemTra === "Thi học kỳ I" || d.LoaiKiemTra === "Thi học kỳ II")?.Diem ?? "" }
        ]
      };
      const res = await reportService.addScore(payload);
      if (res?.data?.EC === 0) {
        toast.success("Thêm điểm thành công");
        closeAddModal();
        setRefreshFlag(f => f + 1); // trigger refresh
      } else {
        toast.error(res?.data?.EM || "Không thể thêm điểm");
      }
    } catch {
      toast.error("Không thể kết nối đến máy chủ");
    }
  };

  const updateGrade = async (data) => {
    try {
      const payload = {
        HoTen: data.HoTen || data.name,
        TenLop: filters.class,
        TenMonHoc: filters.subject,
        TenHocKy: filters.semester,
        TenNamHoc: filters.year,
        DiemTP: [
          { LoaiKiemTra: "Kiểm tra 15 phút", Diemmoi: data.DiemTP?.find(d => d.LoaiKiemTra === "Kiểm tra 15 phút")?.Diemmoi ?? data.test15 ?? "" },
          { LoaiKiemTra: "Kiểm tra 1 tiết", Diemmoi: data.DiemTP?.find(d => d.LoaiKiemTra === "Kiểm tra 1 tiết")?.Diemmoi ?? data.test1period ?? "" },
          { LoaiKiemTra: getFinalTestType(filters.semester), Diemmoi: data.DiemTP?.find(d => d.LoaiKiemTra === "Thi học kỳ" || d.LoaiKiemTra === "Thi học kỳ I" || d.LoaiKiemTra === "Thi học kỳ II")?.Diemmoi ?? data.final ?? "" }
        ]
      };
      const res = await reportService.editScore(payload);
      if (res?.data?.EC === 0) {
        toast.success("Cập nhật điểm thành công");
        closeEditModal();
        setRefreshFlag(f => f + 1); // trigger refresh
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
    editModalOpen,
    addModalOpen,
    currentEditGrade,
    openEditModal,
    closeEditModal,
    openAddModal,
    closeAddModal,
    addGrade,
    updateGrade,
    removeGrade,
    selectedStudent
  };
};

export default useSubjectGradeTable;