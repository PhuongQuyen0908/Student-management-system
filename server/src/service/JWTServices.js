import db from '../models/index'
const getGroupWithRoles = async (user) =>{
       let roles =  await db.nhomnguoidung.findOne({
            where:{MaNhom: user.MaNhom},
            attributes: ["MaNhom" , "TenNhom" ],
            include: {
                model:db.chucnang 
                , attributes:["MaChucNang" ,"TenManHinhDuocLoad", "TenChucNang"],
                through:{attributes:[]}
            }
        })
        return roles ? roles : {};
}

module.exports = {
    getGroupWithRoles
}