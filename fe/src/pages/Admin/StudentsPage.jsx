import StudentTable from '../../components/StudentTable';

const StudentsPage = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Danh sách học sinh</h2>
            <StudentTable />
        </div>
    );
};

export default StudentsPage;