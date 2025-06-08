import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { fetchAllStudent } from '../../services/studentServices';
import { addStudentToClass, getClassListByNameAndYear } from '../../services/classListService';
import { toast } from 'react-toastify';

const ModalStudentList = ({ show, handleClose, selectedYear, selectedClass, onSave }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [existingStudentIds, setExistingStudentIds] = useState([]);

    useEffect(() => {
        if (show) {
            fetchAvailableStudents();
        }
    }, [show, selectedClass, selectedYear]);

    const fetchAvailableStudents = async () => {
        setLoading(true);
        try {
            // First, get the list of students already in the class
            const classResponse = await getClassListByNameAndYear(selectedClass, selectedYear);
            let existingIds = [];
            
            if (classResponse?.data?.EC === 0 && classResponse.data.DT.length > 0) {
                const classData = classResponse.data.DT[0];
                existingIds = (classData.ct_dsls || []).map(item => item.MaHocSinh);
                setExistingStudentIds(existingIds);
            }
            
            // Then, get all students
            const response = await fetchAllStudent(1, 100, '', 'HoTen', 'asc');
            if (response?.data?.DT?.users) {
                // Filter out students already in the class
                const allStudents = response.data.DT.users;
                const availableStudents = allStudents.filter(
                    student => !existingIds.includes(student.MaHocSinh)
                );
                
                setStudents(availableStudents);
            } else {
                toast.error('Không thể tải danh sách học sinh');
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.error('Lỗi kết nối máy chủ');
        } finally {
            setLoading(false);
        }
    };

    const toggleStudentSelection = (student) => {
        if (selectedStudents.includes(student.MaHocSinh)) {
            setSelectedStudents(selectedStudents.filter(id => id !== student.MaHocSinh));
        } else {
            setSelectedStudents([...selectedStudents, student.MaHocSinh]);
        }
    };

    const toggleAllStudents = () => {
        if (selectedStudents.length === filteredStudents.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(filteredStudents.map(student => student.MaHocSinh));
        }
    };

    const handleSaveChanges = async () => {
        try {
            // Call API to add selected students to class
            // Implementation will depend on your backend
            toast.success('Thêm học sinh thành công');
            if (onSave) onSave(selectedStudents);
            handleClose();
        } catch (error) {
            toast.error('Lỗi khi thêm học sinh vào lớp');
        }
    };

    // Filter students based on search term
    const filteredStudents = students.filter(student => 
        student.HoTen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.Email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Modal show={show} onHide={handleClose} size="xl" centered>
            <Modal.Header closeButton>
                <Modal.Title>DANH SÁCH HỌC SINH</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <hr />
                <div className="mb-3 d-flex">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="light" className="ms-2">🔍</Button>
                </div>

                <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <table className="table table-bordered table-striped">
                        <thead className="table-success text-center">
                            <tr>
                                <th>
                                    <input 
                                        type="checkbox" 
                                        checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                                        onChange={toggleAllStudents}
                                    />
                                </th>
                                <th>STT</th>
                                <th>Họ và tên</th>
                                <th>Giới tính</th>
                                <th>Năm sinh</th>
                                <th>Địa chỉ</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center">Đang tải...</td>
                                </tr>
                            ) : filteredStudents.length > 0 ? (
                                filteredStudents.map((student, index) => (
                                    <tr key={student.MaHocSinh}>
                                        <td className="text-center">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedStudents.includes(student.MaHocSinh)}
                                                onChange={() => toggleStudentSelection(student)}
                                            />
                                        </td>
                                        <td>{index + 1}</td>
                                        <td>{student.HoTen}</td>
                                        <td>{student.GioiTinh}</td>
                                        <td>{student.NgaySinh ? new Date(student.NgaySinh).getFullYear() : ''}</td>
                                        <td>{student.DiaChi}</td>
                                        <td>{student.Email}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">Không tìm thấy học sinh</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Đóng</Button>
                <Button 
                    variant="primary" 
                    onClick={handleSaveChanges}
                    disabled={selectedStudents.length === 0}
                >
                    Lưu thay đổi ({selectedStudents.length})
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalStudentList;