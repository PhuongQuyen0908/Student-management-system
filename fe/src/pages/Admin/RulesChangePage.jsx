import React from "react";
import "../../styles/Page/RulesChangePage.scss";
import TableHeaderAction from "../../components/TableHeaderAction";
import { useState } from "react";
import useParamenterTable from "../../hooks/useParamenter";
import { useEffect } from "react";
import '../../styles/FilterGroup.scss';
const PARAMS = [
  { key: "TuoiToiThieu", label: "Số tuổi tối thiểu" },
  { key: "TuoiToiDa", label: "Số tuổi tối đa" },
  { key: "DiemToiThieu", label: "Số điểm tối thiểu" },
  { key: "DiemToiDa", label: "Số điểm tối đa" },
  { key: "DiemDat", label: "Điểm đạt" },
  { key: "DiemQuaMon", label: "Điểm đạt môn" },
  { key: "SiSoToiDa", label: "Sĩ số" },
];

const RulesChangePage = () => {
  const { parameterList, handleUpdateParamenter } = useParamenterTable();

  const [values, setValues] = useState({});

  // Khi parameterList thay đổi, cập nhật state values
  useEffect(() => {
    const newValues = {};
    PARAMS.forEach((param) => {
      const found = parameterList.find((item) => item.TenThamSo === param.key);
      newValues[param.key] = found ? found.GiaTri : "";
    });
    setValues(newValues);
  }, [parameterList]);

  // Xử lý thay đổi input
  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  // Xử lý khi ấn Lưu
  const handleSave = (key) => {
    handleUpdateParamenter(key, { GiaTri: values[key] });
  };

  //Lấy giá trị từng tham số từ state values
  const {
    TuoiToiThieu = "",
    TuoiToiDa = "",
    DiemToiThieu = "",
    DiemToiDa = "",
    DiemDat = "",
    DiemQuaMon = "",
    SiSoToiDa = "",
  } = values;
  return (
    <div className="ruleschange-page-container">
      <div className="ruleschange-card full">
        <div className="ruleschange-two-column">
          <div className="half">
            <h3>Thêm năm học</h3>
            <label>Năm học</label>
            <div className="input-group">
              <input type="text" placeholder="VD: 2025 - 2026" />
              <button>Thêm</button>
            </div>
          </div>
          <div className="half align-right">
            <h3>Danh sách năm học đã học</h3>
            <div className="filter-group">
              <select>
                <option>2024 - 2025</option>
                <option>2023 - 2024</option>
                <option>2022 - 2023</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="ruleschange-card full">
        <h3>Cài đặt số tuổi</h3>
        <div className="ruleschange-two-column">
          <div className="half">
            <label>Số tuổi tối thiểu</label>
            <div className="input-group">
              <input
                type="number"
                value={TuoiToiThieu}
                onChange={(e) => handleChange("TuoiToiThieu", e.target.value)}
              />
              <button onClick={() => handleSave("TuoiToiThieu")}>Lưu</button>
            </div>
          </div>

          <div className="half">
            <label>Số tuổi tối đa</label>
            <div className="input-group">
              <input
                type="number"
                value={TuoiToiDa}
                onChange={(e) => handleChange("TuoiToiDa", e.target.value)}
              />
              <button onClick={() => handleSave("TuoiToiDa")}>Lưu</button>
            </div>
          </div>
        </div>
      </div>

      <div className="ruleschange-card full">
        <h3>Cài đặt số điểm</h3>
        <div className="ruleschange-two-column">
          <div className="half">
            <label>Số điểm tối thiểu</label>
            <div className="input-group">
              <input
                type="number"
                value={DiemToiThieu}
                onChange={(e) => handleChange("DiemToiThieu", e.target.value)}
              />
              <button onClick={() => handleSave("DiemToiThieu")}>Lưu</button>
            </div>
          </div>
          <div className="half">
            <label>Số điểm tối đa</label>
            <div className="input-group">
              <input
                type="number"
                value={DiemToiDa}
                onChange={(e) => handleChange("TuoiToiDa", e.target.value)}
              />
              <button onClick={() => handleSave("DiemToiDa")}>Lưu</button>
            </div>
          </div>
        </div>
        <div className="ruleschange-two-column">
          <div className="half">
            <label>Điểm đạt</label>
            <div className="input-group">
              <input
                type="number"
                value={DiemDat}
                onChange={(e) => handleChange("DiemDat", e.target.value)}
              />
              <button onClick={() => handleSave("DiemDat")}>Lưu</button>
            </div>
          </div>
          <div className="half">
            <label>Điểm đạt môn</label>
            <div className="input-group">
              <input
                type="number"
                value={DiemQuaMon}
                onChange={(e) => handleChange("DiemQuanMon", e.target.value)}
              />
              <button onClick={() => handleSave("DiemQuaMon")}>Lưu</button>
            </div>
          </div>
        </div>
      </div>

      <div className="ruleschange-card full">
        <h3>Cài đặt sĩ số</h3>
        <div className="single-input">
          <label>Sĩ số</label>
          <div className="input-group">
            <input
              type="number"
              value={SiSoToiDa}
              onChange={(e) => handleChange("SiSoToiDa", e.target.value)}
            />
            <button onClick={() => handleSave("SiSoToiDa")}>Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesChangePage;
