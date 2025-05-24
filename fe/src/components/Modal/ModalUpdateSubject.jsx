import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import _ from 'lodash';
import { updateCurrentSubject } from '../../services/subjectServices';

const ModalUpdateSubject = ({ show, handleClose, dataModalSubject, fetchSubjects }) => {
    const defaultSubjectData = {
        subjectCode: '',
        subjectName: '',
        // passingScore: '',
        coefficient: '',
    };

    const defaultValidInputs = {
        subjectName: true,
        // passingScore: true,
        coefficient: true,
    };

    const [subjectData, setSubjectData] = useState(defaultSubjectData);
    const [validInputs, setValidInputs] = useState(defaultValidInputs);

    useEffect(() => {
        if (dataModalSubject && show) {
            setSubjectData({
                subjectCode: dataModalSubject.MaMonHoc || '',
                subjectName: dataModalSubject.TenMonHoc || '',
                // passingScore: dataModalSubject.DiemDat || '',
                coefficient: dataModalSubject.HeSo || '',
            });
        }
    }, [dataModalSubject, show]);

    const handleOnChangeInput = (value, name) => {
        let _subjectData = _.cloneDeep(subjectData);
        _subjectData[name] = value;
        setSubjectData(_subjectData);
    };

    const isValidInputs = () => {
        setValidInputs(defaultValidInputs);
        let isValid = true;

        if (!subjectData.subjectName) {
            toast.error('Tên môn học là bắt buộc');
            setValidInputs({ ...defaultValidInputs, subjectName: false });
            isValid = false;
        }
        // else if (!subjectData.passingScore) {
        // toast.error('Số điểm đạt là bắt buộc');
        // setValidInputs({ ...defaultValidInputs, passingScore: false });
        // isValid = false;}
        else if (!subjectData.coefficient) {
            toast.error('Hệ số là bắt buộc');
            setValidInputs({ ...defaultValidInputs, coefficient: false });
            isValid = false;
        }

        return isValid;
    };

    const confirmUpdateSubject = async () => {
        const isValid = isValidInputs();
        if (isValid) {
            try {
                let response = await updateCurrentSubject({
                    MaMonHoc: subjectData.subjectCode,
                    TenMonHoc: subjectData.subjectName,
                    HeSo: subjectData.coefficient,
                });

                if (response && response.status === 200) {
                    toast.success(response.data.message || 'Cập nhật thành công');
                    await fetchSubjects();
                    handleClose();
                    setSubjectData(defaultSubjectData);
                    setValidInputs(defaultValidInputs);
                } else {
                    toast.error(response?.data?.message || 'Cập nhật thất bại');
                }
            } catch (error) {
                console.error('Lỗi khi cập nhật môn học:', error);
                toast.error('Lỗi máy chủ (500): Vui lòng kiểm tra lại dữ liệu gửi lên hoặc server API.');
            }
        }
    };


    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Sửa môn học</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label htmlFor="subjectCode" className="form-label">Mã môn học</label>
                    <input
                        type="text"
                        className="form-control"
                        id="subjectCode"
                        value={subjectData.subjectCode}
                        disabled
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="subjectName" className="form-label">Tên môn học</label>
                    <input
                        type="text"
                        className={validInputs.subjectName ? 'form-control' : 'form-control is-invalid'}
                        id="subjectName"
                        value={subjectData.subjectName}
                        onChange={(e) => handleOnChangeInput(e.target.value, 'subjectName')}
                    />
                </div>

                {/* <div className="mb-3">
                    <label htmlFor="passingScore" className="form-label">Số điểm đạt</label>
                    <input
                        type="number"
                        className={validInputs.passingScore ? 'form-control' : 'form-control is-invalid'}
                        id="passingScore"
                        value={subjectData.passingScore}
                        onChange={(e) => handleOnChangeInput(e.target.value, 'passingScore')}
                    />
                </div> */}

                <div className="mb-3">
                    <label htmlFor="coefficient" className="form-label">Hệ số</label>
                    <input
                        type="number"
                        className={validInputs.coefficient ? 'form-control' : 'form-control is-invalid'}
                        id="coefficient"
                        value={subjectData.coefficient}
                        onChange={(e) => handleOnChangeInput(e.target.value, 'coefficient')}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={confirmUpdateSubject}>
                    Sửa
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalUpdateSubject;
