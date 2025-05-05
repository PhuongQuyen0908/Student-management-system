import React, { useState, useEffect } from "react";
import reportService from "D:/Student-management-system-BE-PhuongQuyen/fe/src/services/reportService";
import { toast } from "react-toastify";
import Select from "react-select";
import '../styles/Modal.scss';

const SubjectReportPage = () => {
  const [lopId, setLopId] = useState('');
  const [hocKyId, setHocKyId] = useState('');
  const [namHocId, setNamHocId] = useState('');
  const [monHocId, setMonHocId] = useState('');
  const [reportData, setReportData] = useState(null);
  const [editableData, setEditableData] = useState([]);
  const [activeModal, setActiveModal] = useState({ index: null });
  const [modalData, setModalData] = useState({});
  const [deleteModal, setDeleteModal] = useState({ index: null });

  const [options, setOptions] = useState({ lop: [], hocKy: [], namHoc: [], monHoc: [] });

  useEffect(() => {
    async function fetchOptions() {
      try {
        const response = await reportService.getOptions();
        setOptions({
          lop: response.data.lop,
          hocKy: response.data.hocKy,
          namHoc: response.data.namHoc,
          monHoc: response.data.monHoc,
        });
      } catch {
        toast.error("Không thể tải dữ liệu!");
      }
    }
    fetchOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await reportService.getSubjectSummary({ lopId, hocKyId, namHocId, monHocId });
      if (response?.data) {
        setReportData(response.data);
        setEditableData(response.data.DiemChiTiet);
        toast.success("Lấy bảng điểm thành công!");
      } else {
        toast.error("Dữ liệu trả về không hợp lệ.");
      }
    } catch {
      toast.error("Lỗi khi lấy bảng điểm!");
    }
  };

  const handleSelectChange = (selectedOption, name) => {
    const value = selectedOption ? selectedOption.value : "";
    if (name === "lopId") setLopId(value);
    if (name === "hocKyId") setHocKyId(value);
    if (name === "namHocId") setNamHocId(value);
    if (name === "monHocId") setMonHocId(value);
  };

  const handleSave = async (studentIndex) => {
    const student = editableData[studentIndex];
    try {
      await reportService.updateStudentScores({
        HoTen: student.HoTen,
        TenLop: reportData.TenLop,
        TenMonHoc: reportData.TenMonHoc,
        TenHocKy: reportData.TenHocKy,
        TenNamHoc: reportData.TenNamHoc,
        DiemTP: student.DiemTP
      });
      toast.success("Cập nhật điểm thành công!");
    } catch {
      toast.error("Lỗi khi cập nhật điểm!");
    }
  };

  const openModal = (index) => {
    const student = editableData[index];
    if (!student?.DiemTP || student.DiemTP.length === 0) {
      toast.warn("Học sinh này chưa có điểm để chỉnh sửa!");
      return;
    }

    const grouped = {};
    student.DiemTP.forEach(tp => {
      if (!grouped[tp.LoaiKiemTra]) grouped[tp.LoaiKiemTra] = [];
      grouped[tp.LoaiKiemTra].push(tp.Diem);
    });

    setModalData(grouped);
    setActiveModal({ index });
  };

  const closeModal = () => {
    setActiveModal({ index: null });
    setModalData({});
  };

  const handleModalChange = (loai, idx, value) => {
    const updated = { ...modalData };
    updated[loai][idx] = value;
    setModalData(updated);
  };

  const handleAddScoreField = (loai) => {
    const updated = { ...modalData };
    if (!updated[loai]) updated[loai] = [];
    updated[loai].push("");
    setModalData(updated);
  };

  const handleModalSubmit = () => {
    const updated = [...editableData];
    const index = activeModal.index;
    const original = updated[index];
    const newDiemTP = [];

    for (let loai in modalData) {
      modalData[loai].forEach((d, idx) => {
        if (d !== "") {
          const originHeSo = original.DiemTP.find(tp => tp.LoaiKiemTra === loai)?.HeSo || 1;
          newDiemTP.push({ LoaiKiemTra: loai, Diem: d, HeSo: originHeSo });
        }
      });
    }

    updated[index].DiemTP = newDiemTP;
    setEditableData(updated);
    closeModal();
  };

  const handleDeletePoint = (loai, diem) => {
    const index = deleteModal.index;
    const updated = [...editableData];
    updated[index].DiemTP = updated[index].DiemTP.filter(tp => !(tp.LoaiKiemTra === loai && tp.Diem === diem));
    setEditableData(updated);
  };

  const allLoaiKiemTra = Array.from(
    new Set(editableData.flatMap(hs => hs.DiemTP.map(tp => tp.LoaiKiemTra)))
  );

  return (
    <div className="main-content">
      <h1>Lập báo cáo tổng kết môn học</h1>
      <form onSubmit={handleSubmit}>
        <div><label>Tên lớp:</label><Select options={options.lop} onChange={opt => handleSelectChange(opt, "lopId")} placeholder="Chọn lớp" /></div>
        <div><label>Tên học kỳ:</label><Select options={options.hocKy} onChange={opt => handleSelectChange(opt, "hocKyId")} placeholder="Chọn học kỳ" /></div>
        <div><label>Tên năm học:</label><Select options={options.namHoc} onChange={opt => handleSelectChange(opt, "namHocId")} placeholder="Chọn năm học" /></div>
        <div><label>Tên môn học:</label><Select options={options.monHoc} onChange={opt => handleSelectChange(opt, "monHocId")} placeholder="Chọn môn học" /></div>
        <button type="submit">Tải báo cáo</button>
      </form>

      {reportData && (
        <div>
          <h2>Bảng điểm môn học</h2>
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Họ tên</th>
                {allLoaiKiemTra.map((loai, i) => (
                  <th key={i}>{loai}</th>
                ))}
                <th>Điểm TB</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {editableData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.HoTen}</td>
                  {allLoaiKiemTra.map((loai, i) => {
                    const points = item.DiemTP.filter(tp => tp.LoaiKiemTra === loai).map(tp => tp.Diem).join(", ");
                    return <td key={i}>{points}</td>;
                  })}
                  <td>{item.DiemTB}</td>
                  <td>
                    <button onClick={() => openModal(index)}>Chỉnh sửa</button>
                    <button onClick={() => setDeleteModal({ index })} style={{ marginLeft: '6px' }}>Xoá điểm</button>
                    <button onClick={() => handleSave(index)} style={{ marginLeft: '6px' }}>Lưu</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeModal.index !== null && (
        <>
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="modal">
            <h3>Chỉnh sửa điểm</h3>
            {Object.entries(modalData).map(([loai, values], idx) => (
              <div key={idx} style={{ marginBottom: '10px' }}>
                <label>{loai}:</label>{" "}
                {values.map((val, i) => (
                  <input
                    key={i}
                    type="number"
                    value={val}
                    step="0.25"
                    onChange={(e) => handleModalChange(loai, i, e.target.value)}
                    style={{ marginRight: '8px' }}
                  />
                ))}
                <button type="button" onClick={() => handleAddScoreField(loai)}>+ Thêm</button>
              </div>
            ))}
            <div style={{ marginTop: '10px' }}>
              <button onClick={handleModalSubmit}>Cập nhật</button>
              <button onClick={closeModal} style={{ marginLeft: '10px' }}>Huỷ</button>
            </div>
          </div>
        </>
      )}

      {deleteModal.index !== null && (
        <>
          <div className="modal-overlay" onClick={() => setDeleteModal({ index: null })}></div>
          <div className="modal">
            <h3>Xoá điểm học sinh</h3>
            {allLoaiKiemTra.map((loai, i) => {
              const list = editableData[deleteModal.index].DiemTP.filter(tp => tp.LoaiKiemTra === loai);
              if (!list.length) return null;
              return (
                <div key={i}>
                  <strong>{loai}:</strong>{" "}
                  {list.map((tp, j) => (
                    <span key={j} style={{ marginRight: '8px' }}>
                      {tp.Diem}
                      <button onClick={() => handleDeletePoint(loai, tp.Diem)} style={{ marginLeft: '4px', color: 'red' }}>✖</button>
                    </span>
                  ))}
                </div>
              );
            })}
            <div style={{ marginTop: '10px' }}>
              <button onClick={() => setDeleteModal({ index: null })}>Đóng</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SubjectReportPage;
