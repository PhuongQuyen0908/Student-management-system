//viết api CRUD student
 import studentApiService from "../service/studentAPIService";

const readFunc = async (req, res) => {
  try {
    
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;

      let data = await studentApiService.getStudentWithPagination(+page, +limit); // chuyển thành số để dùng sql
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC, //error code
        DT: data.DT, //data
      });
    } else {
      let data = await studentApiService.getAllStudent();
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC, //error code
        DT: data.DT, //data
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server", //error message
      EC: "-1", //error code
      DT: "", //data
    });
  }
};

const createFunc = async (req, res) => {
  try {
    let data = req.body;
    let age = await studentApiService.getAgeLimit();
    console.log("check data", data);
    const tuoiToiThieu = parseInt(
      age.DT.find(item => item.TenThamSo === "TuoiHocSinhToiThieu")?.GiaTri
    ) || null; // lấy tuổi tối thiểu
    
    const tuoiToiDa = parseInt(
      age.DT.find(item => item.TenThamSo === "TuoiHocSinhToiDa")?.GiaTri
    ) || null; // lấy tuổi tối đa

    if (data.studentBirth) {
      const currentDate = new Date();
      const birthDate = new Date(data.studentBirth);
      const ageInMilliseconds = currentDate - birthDate;
      const ageInYears = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25));

      if (ageInYears < tuoiToiThieu || ageInYears > tuoiToiDa) {
        return res.status(400).json({
          EM: `Tuổi học sinh không hợp lệ! Tuổi tối thiểu là ${tuoiToiThieu} và tối đa là ${tuoiToiDa}`,
          EC: -1,
          DT: "",
        });
      }
    }

    let dataUser = await studentApiService.createNewStudent(data);
    return res.status(200).json({
      EM: dataUser.EM,
      EC: dataUser.EC, //error code
      DT: dataUser.DT, //data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server", //error message
      EC: "-1", //error code
      DT: "", //data
    });
  }
};

const updateFunc =  async (req, res) => {
  try {
    console.log("check update", req.body);
    let data = await studentApiService.updateStudent(req.body); 
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC, //error code
      DT: data.DT, //data
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server", //error message
      EC: "-1", //error code
      DT: "", //data
    });
  }
};

const deleteFunc = async (req, res) => {
  try {
    let data = await studentApiService.deleteStudent(req.body.MaHocSinh);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC, //error code
      DT: data.DT, //data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server", //error message
      EC: "-1", //error code
      DT: "", //data
    });
  }
};

module.exports = {
  readFunc,
  createFunc,
  updateFunc,
  deleteFunc,
};