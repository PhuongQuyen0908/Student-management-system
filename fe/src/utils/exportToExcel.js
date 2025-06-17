// utils/exportToExcel.js
import * as XLSX from 'xlsx';

const exportToExcel = (data, fileName = 'ExportedData.xlsx') => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Tạo file Excel và trigger download
    XLSX.writeFile(workbook, fileName);
  } catch (error) {
    console.error('Lỗi khi xuất Excel:', error);
    alert('Xuất Excel thất bại.');
  }
};

export default exportToExcel;
