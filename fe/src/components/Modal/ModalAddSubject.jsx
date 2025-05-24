import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import { toast } from 'react-toastify';
import _ from "lodash";
import { createSubject } from '../../services/subjectServices';

const ModalAddSubject = ({ show, handleClose, fetchSubjects }) => {
    const defaultSubjectData = {
        subjectName: '',
        coefficient: ''
    };

    const defaultValidInputs = {
        subjectName: true,
        coefficient: true
    };

    const [subjectData, setSubjectData] = useState(defaultSubjectData);
    const [validInputs, setValidInputs] = useState(defaultValidInputs);

    const handleOnChangeInput = (value, name) => {
        let _subjectData = _.cloneDeep(subjectData);
        _subjectData[name] = value;
        setSubjectData(_subjectData);
    };

    const isValidInputs = () => {
        setValidInputs(defaultValidInputs);

        let isValid = true;
        const requiredFields = ['subjectName', 'coefficient'];

        for (let field of requiredFields) {
            if (!subjectData[field]) {
                toast.error(`${field === 'subjectName' ? 'Tên môn học' : 'Hệ số'} là bắt buộc`);
                setValidInputs({ ...defaultValidInputs, [field]: false });
                isValid = false;
                break;
            }
        }

        return isValid;
    };

    const confirmAddSubject = async () => {
        const isValid = isValidInputs();
        if (isValid) {
            const requestData = {
                TenMonHoc: subjectData.subjectName,
                HeSo: subjectData.coefficient
            };

            try {
                let response = await createSubject(requestData);

                if (response && response.data && response.status === 201) {
                    toast.success(response.data.message || "Tạo môn học thành công!");
                    await fetchSubjects();
                    handleClose();
                    setSubjectData(defaultSubjectData);
                    setValidInputs(defaultValidInputs);
                }
            } catch (error) {
                console.error("Error creating subject:", error.response?.data);
                toast.error(error.response?.data?.message || "Tạo môn học thất bại!");
            }
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Thêm môn học</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label htmlFor="subjectName" className="form-label">Tên môn học</label>
                    <input
                        type="text"
                        className={validInputs.subjectName ? "form-control" : "form-control is-invalid"}
                        id="subjectName"
                        value={subjectData.subjectName}
                        onChange={(e) => handleOnChangeInput(e.target.value, 'subjectName')}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="coefficient" className="form-label">Hệ số</label>
                    <input
                        type="number"
                        className={validInputs.coefficient ? "form-control" : "form-control is-invalid"}
                        id="coefficient"
                        value={subjectData.coefficient}
                        onChange={(e) => handleOnChangeInput(e.target.value, 'coefficient')}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Hủy</Button>
                <Button variant="primary" onClick={confirmAddSubject}>Thêm</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalAddSubject;
