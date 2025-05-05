import React, { useState, useEffect } from "react";
import reportService from "D:/Student-management-system-BE-PhuongQuyen/fe/src/services/reportService";
import { toast } from "react-toastify";
import Select from "react-select";

const SubjectReportPage = () => {
  const [hocKyId, setHocKyId] = useState('');
  const [namHocId, setNamHocId] = useState('');
  const [monHocId, setMonHocId] = useState('');
  const [reportData, setReportData] = useState([]);

  const [options, setOptions] = useState({
    hocKy: [],
    namHoc: [],
    monHoc: [],
  });

  useEffect(() => {
    async function fetchOptions() {
      try {
        const response = await reportService.getOptions();
        setOptions({
          hocKy: response.data.hocKy,
          namHoc: response.data.namHoc,
          monHoc: response.data.monHoc,
        });
      } catch (error) {
        toast.error("Không thể tải dữ liệu!");
      }
    }

    fetchOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await reportService.getMonTheoTen({
        mon: monHocId,
        hocky: hocKyId,
        namhoc: namHocId,
      });

      if (response && response.data) {
        setReportData(response.data.ketQua);
        toast.success("Lấy báo cáo thành công!");
      } else {
        toast.error("Dữ liệu trả về không hợp lệ.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy báo cáo: ", error);
      toast.error("Lỗi khi lấy báo cáo!");
    }
  };

  const handleSelectChange = (selectedOption, name) => {
    const value = selectedOption ? selectedOption.value : "";
    if (name === "hocKyId") setHocKyId(value);
    else if (name === "namHocId") setNamHocId(value);
    else if (name === "monHocId") setMonHocId(value);
  };

  return (
    <div className="main-content">
      <h1>Lập báo cáo tổng kết môn học</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên học kỳ:</label>
          <Select
            options={options.hocKy}
            onChange={(selected) => handleSelectChange(selected, "hocKyId")}
            placeholder="Chọn học kỳ"
          />
        </div>

        <div>
          <label>Tên năm học:</label>
          <Select
            options={options.namHoc}
            onChange={(selected) => handleSelectChange(selected, "namHocId")}
            placeholder="Chọn năm học"
          />
        </div>

        <div>
          <label>Tên môn học:</label>
          <Select
            options={options.monHoc}
            onChange={(selected) => handleSelectChange(selected, "monHocId")}
            placeholder="Chọn môn học"
          />
        </div>

        <button type="submit">Tải báo cáo</button>
      </form>

      {reportData.length > 0 && (
        <div>
          <h2>Kết quả tổng kết môn</h2>
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Lớp</th>
                <th>Sĩ số</th>
                <th>Số lượng đạt</th>
                <th>Tỷ lệ</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.Lop}</td>
                  <td>{item.SiSo}</td>
                  <td>{item.SoLuongDat}</td>
                  <td>{item.TiLe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubjectReportPage;
