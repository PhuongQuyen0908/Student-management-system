const applySort = (data, sortBy, order = 'asc') => {
  if (!sortBy || !Array.isArray(data)) return data;

  return [...data].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    // Xử lý nếu là chuỗi có phần trăm (e.g. '25.00%')
    if (typeof valA === 'string' && valA.includes('%')) {
      valA = parseFloat(valA.replace('%', '')) || 0;
    }
    if (typeof valB === 'string' && valB.includes('%')) {
      valB = parseFloat(valB.replace('%', '')) || 0;
    }

    // Nếu là số
    if (typeof valA === 'number' && typeof valB === 'number') {
      return order === 'asc' ? valA - valB : valB - valA;
    }

    // Nếu là chuỗi (sau khi loại bỏ % nếu có)
    if (typeof valA === 'string' && typeof valB === 'string') {
      return order === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    // Nếu không xác định rõ kiểu → chuyển sang string để so sánh
    return order === 'asc'
      ? (valA + '').localeCompare(valB + '')
      : (valB + '').localeCompare(valA + '');
  });
};

module.exports = { applySort };
