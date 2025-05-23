const sortSubjectReportService = (data, sortBy = 'siSo', order = 'asc') => {
  const compare = (a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (typeof valA === 'string' && valA.includes('%')) {
      valA = parseFloat(valA.replace('%', ''));
      valB = parseFloat(valB.replace('%', ''));
    }

    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  };

  return [...data].sort(compare);
};

module.exports = sortSubjectReportService;
