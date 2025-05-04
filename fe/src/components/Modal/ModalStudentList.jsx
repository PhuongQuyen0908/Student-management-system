import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ModalStudentList = ({ show, handleClose }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const students = [
        { id: 1, name: 'minhzzzzz', gender: 'Nam', birthYear: 2024, address: 'TP Biên Hòa', email: 'abcd@gmail.com' },
        { id: 2, name: 'minhzz', gender: 'Nữ', birthYear: 2003, address: 'ádƒ xcv ứ', email: 'mizz@gm.com' },
        { id: 3, name: 'luyenzzzz', gender: 'Nam', birthYear: 2002, address: 'abcd BH', email: 'luyenzz@gm.com' },
    ];

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                        placeholder="Search.."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="light" className="ms-2">🔍</Button>
                </div>

                <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <table className="table table-bordered table-striped">
                        <thead className="table-success text-center">
                            <tr>
                                <th><input type="checkbox" /></th>
                                <th>STT</th>
                                <th>Họ và tên</th>
                                <th>Giới tính</th>
                                <th>Năm sinh</th>
                                <th>Địa chỉ</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student, index) => (
                                <tr key={student.id}>
                                    <td><input type="checkbox" /></td>
                                    <td>{index + 1}</td>
                                    <td>{student.name}</td>
                                    <td>{student.gender}</td>
                                    <td>{student.birthYear}</td>
                                    <td>{student.address}</td>
                                    <td>{student.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Đóng</Button>
                <Button variant="primary">Lưu thay đổi</Button>
            </Modal.Footer>
        </Modal>
    );
};
export default ModalStudentList;
