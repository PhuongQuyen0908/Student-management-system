import db from '../models/index.js';

const CreateGroup = async (groupData) => { // chỉ đang hỗ trợ tạo cùng lúc 1 nhóm
 try{
    // Kiểm tra xem nhóm đã tồn tại chưa
    const existingGroup = await db.nhomnguoidung.findOne({
      where: { TenNhom: groupData.TenNhom }
    });
    
    if (existingGroup) {
        return {
            EM: "Nhóm đã tồn tại",
            EC: 1,
            DT: []
        }
    }
    
    // Tạo nhóm mới
    const newGroup = await db.nhomnguoidung.create(groupData);
    return {
        EM: "Tạo nhóm thành công",
        EC: 0,
        DT: newGroup
    }
 }catch (error) {
    console.error("Lỗi khi tạo nhóm:", error);
    return {
        EM: "Lỗi từ service",
        EC: -1,
        DT: []
    }
 }   
}


const GetAllGroups = async () => {
    try {
        const groups = await db.nhomnguoidung.findAll();
        return {
            EM: "Lấy danh sách nhóm thành công",
            EC: 0,
            DT: groups
        }
    } catch (error) {
        console.error("Lỗi khi lấy danh sách nhóm:", error);
        return {
            EM: "Lỗi từ service",
            EC: -1,
            DT: []
        }
    }
}


const GetGroupsForAdmin = async () => {
    try {
        const groups = await db.nhomnguoidung.findAll();
        return {
            EM: "Lấy danh sách nhóm thành công",
            EC: 0,
            DT: groups
        }
    } catch (error) {
        console.error("Lỗi khi lấy danh sách nhóm:", error);
        return {
            EM: "Lỗi từ service",
            EC: -1,
            DT: []
        }
    }
}

module.exports = {
    CreateGroup,
    GetAllGroups,
    GetGroupsForAdmin
};