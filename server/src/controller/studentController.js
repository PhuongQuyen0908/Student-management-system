//viết api CRUD student
 import studentApiService from "../service/studentAPIService";

const readFunc = async (req, res) => {
  try {
    if(req.query.MaNamHoc && req.query.page && req.query.limit) { // tìm theo năm học
      let page = req.query.page;
      let limit = req.query.limit;
      let data = await studentApiService.getAllStudentWithYear(req.query.MaNamHoc , +page , +limit ); // chuyển thành số để dùng sql
      console.log("check data", data);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC, //error code
        DT: data.DT, //data
      });} 
    else if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;
      if (req.query.search) { //nếu có seach truyền vào
        let search = req.query.search;
        let data = await studentApiService.getAllStudentWithSearch(search, +page, +limit); // chuyển thành số để dùng sql
        return res.status(200).json({
          EM: data.EM,
          EC: data.EC, //error code
          DT: data.DT, //data
        });
      } else{
      let data = await studentApiService.getStudentWithPagination(+page, +limit); // chuyển thành số để dùng sql
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC, //error code
        DT: data.DT, //data
      })};
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