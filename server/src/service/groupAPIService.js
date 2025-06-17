import db from '../models/index.js';
const { Op, fn, col, where } = require("sequelize");


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


const GetGroupsForAdmin = async (search ="" ,sortField ,sortOrder) => {
    try {
        // Tìm kiếm nhóm theo tên nếu có
       const whereClause = search ? {
           [Op.or]: [
            { MaNhom: isNaN(Number(search)) ? -1 : Number(search) },
            { TenNhom: { [Op.like]: `%${search}%` } },
            { MoTa: { [Op.like]: `%${search}%` } },
          ],
        } : {};
        const groups = await db.nhomnguoidung.findAll({
            where: whereClause, // <-- Thêm dòng này để lọc theo search
            order: [[sortField || 'MaNhom', sortOrder || 'ASC']], // Sắp xếp theo trường và thứ tự
        });
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


const DeleteGroup = async (MaNhom) => {
    try {
        // Kiểm tra xem nhóm có tồn tại không
        const group = await db.nhomnguoidung.findByPk(MaNhom);
        if (!group) {
            return {
                EM: "Nhóm không tồn tại",
                EC: 1,
                DT: []
            }
        }   
        if(group.TenNhom ==="Super Admin"){
            return {
                EM: "Không thể xóa nhóm Super Admin",
                EC: 2,
                DT: []
            }
        }
        // Xóa nhóm
        await db.nhomnguoidung.destroy({
            where: { MaNhom }
        });
        
        return {
            EM: "Xóa nhóm thành công",
            EC: 0,
            DT: []
        }
    } catch (error) {
        console.error("Lỗi khi xóa nhóm:", error);
        return {
            EM: "Vui lòng gỡ toàn bộ quyền của nhóm và gỡ nhóm khỏi toàn bộ tài khoản trước khi xóa",
            EC: -1,
            DT: []
        }
    }
}
module.exports = {
    CreateGroup,
    GetAllGroups,
    GetGroupsForAdmin,
    DeleteGroup
};