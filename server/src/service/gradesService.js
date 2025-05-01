// src/service/gradesService.js
const { HocSinh, MonHoc, BDMONHOC } = require('../models');

// Hàm tính điểm trung bình
function calculateAverage(grades) {
    const totalScore = grades.reduce((sum, grade) => sum + grade, 0);
    return totalScore / grades.length;
}

// Hàm lấy bảng điểm môn học cho lớp và học kỳ
async function getGradesForClassAndSemester(className, semester) {
    try {
        // Truy vấn dữ liệu bảng điểm từ các bảng HOCSINH, MONHOC, và BDMONHOC
        const grades = await HocSinh.findAll({
            include: [
                {
                    model: MonHoc,  // Kết nối bảng MONHOC
                },
                {
                    model: BDMONHOC, // Kết nối bảng BDMONHOC
                    where: { HocKy: semester },  // Lọc theo học kỳ
                }
            ],
            where: { MaLop: className },  // Lọc theo lớp
        });

        // Tính toán điểm trung bình cho mỗi học sinh
        const gradeData = grades.map(grade => ({
            HoTen: grade.HoTen,
            Diem15: grade.BDMONHOC.Diem15,
            Diem1Tiet: grade.BDMONHOC.Diem1Tiet,
            DiemTB: calculateAverage([
                grade.BDMONHOC.Diem15,
                grade.BDMONHOC.Diem1Tiet,
            ])
        }));

        return gradeData;

    } catch (error) {
        console.error('Error fetching grades:', error);
        throw new Error('An error occurred while fetching the grades');
    }
}

module.exports = { getGradesForClassAndSemester };
