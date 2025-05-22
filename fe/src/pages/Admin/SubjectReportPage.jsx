import React from 'react';
import '../../styles/Page/SubjectReportPage.scss'
import { useState } from 'react';
import axios from 'axios';
import SubjectReportFilters from '../../components/Modal/SubjectReportFilter';
import SubjectReportTable from '../../components/Table/SubjectReportTable';
import TableHeaderAction from '../../components/TableHeaderAction';
import '../../styles/Table/SubjectReportTable.scss';
import reportService from '../../services/reportService';

const SubjectReportPage = () => {
    const [rawData, setRawData] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [reportMeta, setReportMeta] = useState({
        monHoc: '',
        hocKy: '',
        namHoc: '',
    });

    const [sortConfig, setSortConfig] = useState({
    sortBy: null,
    order: 'asc',
  });

    const handleFilterSubmit = async (filters) => {
        try {
            const res = await reportService.getSubjectReport(filters);
            if (res.status === 200) {
                const { ketQua, monHoc, hocKy, namHoc } = res.data.DT;
                setRawData(ketQua || []);           // lưu lại dữ liệu gốc
                setReportMeta({ monHoc, hocKy, namHoc });
                setReportData(ketQua || []);        // hiển thị như cũ, chưa sort
                setSortConfig({ sortBy: null, order: 'asc' }); // reset sort
                }
            else {
                alert('Không thể lấy báo cáo.');
            }
        } catch (err) {
            console.error(err);
            alert('Lỗi kết nối đến server.');
        }
    };

    const handleSort = async (key) => {
    const newOrder =
      sortConfig.sortBy === key && sortConfig.order === 'asc' ? 'desc' : 'asc';

    setSortConfig({ sortBy: key, order: newOrder });

    try {
      const sortRes = await reportService.sortSubjectReport({
        data: rawData,
        sortBy: key,
        order: newOrder,
      });

      if (sortRes.status === 200) {
        setReportData(sortRes.data.DT || []);
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi khi sắp xếp dữ liệu');
    }
  };


    return (
        <div className="subjectreport-page-container">
        <div className="subjectreport-table-wrapper">
            <SubjectReportFilters onSubmit={handleFilterSubmit} />

            <TableHeaderAction
                onSearchChange={(value) => console.log('Tìm kiếm:', value)}
                placeholder="Tìm kiếm lớp..."
                hideAdd={true}
            />

            <SubjectReportTable
                data={reportData}
                meta={reportMeta}
                onSort={handleSort}
                sortConfig={sortConfig}
            />
        </div>
        </div>
    );
};

export default SubjectReportPage;
