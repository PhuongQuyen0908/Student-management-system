import React, { useState, useEffect } from "react";
import reportService from "D:/Student-management-system-BE-PhuongQuyen/fe/src/services/reportService";
import { toast } from "react-toastify";
import Select from "react-select";

const SubjectReportPage = () => {
  const [lopId, setLopId] = useState('');
  const [hocKyId, setHocKyId] = useState('');
  const [namHocId, setNamHocId] = useState('');
  const [monHocId, setMonHocId] = useState('');
  const [reportData, setReportData] = useState(null);

  const [options, setOptions] = useState({
    lop: [],
    hocKy: [],
    namHoc: [],
    monHoc: [],
  });

  // Lấy các options từ API khi component mount
  useEffect(() => {
    async function fetchOptions() {
      try {
        const response = await reportService.getOptions();
        console.log("Dữ liệu lớp học: ", response.data.lop);
        setOptions({
          lop: response.data.lop,
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
      const response = await reportService.getSubjectSummary({
        lopId,
        hocKyId,
        namHocId,
        monHocId,
      });
  
      // Debugging logs to check the response structure
      console.log(response); // Check the structure of the response object
  
      if (response && response.data) {
        setReportData(response.data);
        toast.success("Lấy bảng điểm thành công!");
      } else {
        toast.error("Dữ liệu trả về không hợp lệ.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy bảng điểm: ", error); // Enhanced error logging
      toast.error("Lỗi khi lấy bảng điểm!");
    }
  };
  

  // Hàm xử lý thay đổi chọn lớp, học kỳ, môn học, năm học
  const handleSelectChange = (selectedOption, name) => {
    if (name === "lopId") {
      setLopId(selectedOption ? selectedOption.value : "");
    } else if (name === "hocKyId") {
      setHocKyId(selectedOption ? selectedOption.value : "");
    } else if (name === "namHocId") {
      setNamHocId(selectedOption ? selectedOption.value : "");
    } else if (name === "monHocId") {
      setMonHocId(selectedOption ? selectedOption.value : "");
    }
  };

  return (
    <div className="main-content">
      <h1>Lập báo cáo tổng kết môn học</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên lớp:</label>
          <Select
            options={options.lop}
            onChange={(selectedOption) => handleSelectChange(selectedOption, "lopId")}
            placeholder="Chọn lớp"
          />
        </div>

        <div>
          <label>Tên học kỳ:</label>
          <Select
            options={options.hocKy}
            onChange={(selectedOption) => handleSelectChange(selectedOption, "hocKyId")}
            placeholder="Chọn học kỳ"
          />
        </div>

        <div>
          <label>Tên năm học:</label>
          <Select
            options={options.namHoc}
            onChange={(selectedOption) => handleSelectChange(selectedOption, "namHocId")}
            placeholder="Chọn năm học"
          />
        </div>

        <div>
          <label>Tên môn học:</label>
          <Select
            options={options.monHoc}
            onChange={(selectedOption) => handleSelectChange(selectedOption, "monHocId")}
            placeholder="Chọn môn học"
          />
        </div>

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
                <th>Điểm 15'</th>
                <th>Điểm 1 tiết</th>
                <th>Điểm TB</th>
              </tr>
            </thead>
            <tbody>
              {reportData.DiemChiTiet.map((item, index) => (
                <tr key={index}>
                  <td>{item.STT}</td>
                  <td>{item.HoTen}</td>
                  <td>{item.Diem15}</td>
                  <td>{item.Diem1Tiet}</td>
                  <td>{item.DiemTB}</td>
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
