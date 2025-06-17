import { Modal, Button, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import subjectGradeService from '../../services/subjectGradeService';
import { fetchAllSubject } from '../../services/subjectServices';

const ModalStudentGrade = ({
    show,
    onHide,
    student,
    yearName
}) => {
    const [filters, setFilters] = useState({
        year: '',
        class: '',
        semester: ''
    });
    const [options, setOptions] = useState({
        namHoc: [],
        lop: [],
        monHoc: [],
        hocKy: [],
    });
    const [gradesBySemester, setGradesBySemester] = useState([]);

    useEffect(() => {
        const fetchOptions = async () => {
            const res = await subjectGradeService.getOptions();
            if (res.data?.EC === 0) {
                setOptions(res.data.DT);
                setFilters({
                    year: yearName,
                    class: student?.TenLop || '',
                    semester: res.data.DT.hocKy[0]?.value || ''
                });
            }
        };

        const fetchSubjects = async () => {
            const res = await fetchAllSubject({ limit: 100 });
            if (res.data?.EC === 0) {
                const subjectList = res.data.DT.subjects.map(sub => ({
                    label: sub.TenMonHoc,
                    value: sub.TenMonHoc
                }));
                setOptions(prev => ({ ...prev, monHoc: subjectList }));
            }
        };

        if (student && yearName) {
            fetchOptions();
            fetchSubjects();
        }
    }, [student, yearName]);

   useEffect(() => {
    const fetchGradesBySemester = async () => {
        if (!student?.MaHocSinh || !yearName || !student.TenLop || !filters.semester) return;

        const studentId = student.MaHocSinh;
        const results = [];

        for (const subject of options.monHoc) {
            try {
                const res = await subjectGradeService.getSubjectSummary({
                    tenLop: student.TenLop,
                    tenNamHoc: yearName,
                    tenMonHoc: subject.value,
                    tenHocKy: filters.semester,
                    page:1,
                    limit: 100,
                });

                const rows = res.data?.DT?.DT?.DiemChiTiet?.rows || [];
                const row = rows.find(s => s.MaHocSinh == studentId);
            

                if (row) {
                    results.push({
                        monHoc: subject.label,
                        diemTP: row.DiemTP,
                        diemTB: row.DiemTB
                    });
                }
            } catch (err) {
                // Bỏ qua lỗi cho từng môn
                continue;
            }
        }

        setGradesBySemester(results);
    };

    fetchGradesBySemester();
}, [filters.semester, student?.MaHocSinh, yearName, options]);

    const handleFilterChange = (key, value) => {
        setFilters({ ...filters, [key]: value });
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Chi tiết điểm {student?.HoTen}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>Chọn học kỳ</Form.Label>
                    <Form.Select
                        value={filters.semester}
                        onChange={e => handleFilterChange('semester', e.target.value)}
                    >
                        {options.hocKy.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <div className="mt-3">
                    {gradesBySemester.length > 0 ? (
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Môn học</th>
                                    <th>Điểm thành phần</th>
                                    <th>Điểm trung bình</th>
                                </tr>
                            </thead>
                            <tbody>
                                {gradesBySemester.map((g, idx) => (
                                    <tr key={idx}>
                                        <td>{g.monHoc}</td>
                                        <td>
                                            {g.diemTP?.map((item, i) => (
                                                <div key={i}>
                                                    {item.LoaiKiemTra}: {item.Diem} (hệ số {item.HeSo})
                                                </div>
                                            ))}
                                        </td>
                                        <td>{g.diemTB}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Không có bảng điểm cho học kỳ này.</p>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Đóng</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalStudentGrade;
