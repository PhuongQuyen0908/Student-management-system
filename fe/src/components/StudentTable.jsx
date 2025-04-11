const dummyData = [
    {
        id: 'K23521327',
        name: 'Nguyễn Phương Quyên',
        birth: '29-02-2024',
        gender: 'Nữ',
        address: 'Đông Hòa, Dĩ An, Bình Dương',
        email: 'nguyenphuongquyen0908@gmail.com',
    },
];

const StudentTable = () => {
    return (
        <div className="bg-white rounded shadow">
            <table className="w-full text-left">
                <thead className="bg-blue-100 text-gray-700">
                    <tr>
                        <th className="p-2">Mã học sinh</th>
                        <th className="p-2">Họ và tên</th>
                        <th className="p-2">Ngày sinh</th>
                        <th className="p-2">Giới tính</th>
                        <th className="p-2">Địa chỉ</th>
                        <th className="p-2">Email</th>
                    </tr>
                </thead>
                <tbody>
                    {dummyData.map((student, index) => (
                        <tr key={index} className="border-b hover:bg-gray-100">
                            <td className="p-2">{student.id}</td>
                            <td className="p-2">{student.name}</td>
                            <td className="p-2">{student.birth}</td>
                            <td className="p-2">{student.gender}</td>
                            <td className="p-2">{student.address}</td>
                            <td className="p-2">{student.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentTable;
