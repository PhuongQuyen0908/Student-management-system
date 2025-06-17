import React, { useState, useEffect, use } from 'react'
import { getUserAccount } from '../services/userServices'
import { set } from 'lodash';

const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const userDefault = {
    isAuthenticated: false,
    isLoading: true,
    token: "",
    account: {}
  }
  // User is the name of the "data" that gets stored in context
  const [user, setUser] = useState(userDefault);

  // Login updates the user data with a name parameter
  const loginContext = (userData) => {
    setUser({ ...userData, isLoading: false })
  };

  // Logout updates the user data to default
  const logoutContext = () => {
    setUser({ ...userDefault, isLoading: false })
  };

  const fetchUser = async () => {
    let response = await getUserAccount();
    if (response.data && +response.data.EC === 0) {
      let groupWithPermissions = response.data.DT.groupWithPermissions;
      let username = response.data.DT.username;
      let HoTen = response.data.DT.HoTen;
      let token = response.data.DT.access_token;
      let Avatar = response.data.DT.Avatar || null;
      let data = {
        isAuthenticated: true,
        token: token,
        account: { groupWithPermissions, username, HoTen, Avatar },
      }
      setUser(data)
    } else {
      setUser({ ...userDefault, isLoading: false })
    }
  }

  // useEffect(() => {
  //   if (window.location.pathname !== '/' ) {
  //   fetchUser()
  //   }else{
  //     setUser({...user ,isLoading:false})
  //   }
  // }, [])


  useEffect(() => {
    fetchUser();
  }, [])

  //ẩn hiển UI khi không có quyền truy cập vào các chức năng
  const [userPermissions, setUserPermissions] = useState([])//= user.account.groupWithPermissions.chucnangs.map(permission => permission.TenManHinhDuocLoad);
  const [isAvailable, setIsAvailable] = useState({});
  const loadPage = {
    DanhSachHocSinh: ['/student/read'],
    TiepNhanHocSinh: ['/student/create', '/student/read'],
    DanhSachMonHoc: ['/subject/read', '/subject/create', '/subject/update', '/subject/delete'],
    BangDiemMonHoc: ['/report/subject-summary', '/report/add-score', '/report/edit-score', '/report/delete-score', '/test/create'],
    LoaiKiemTra: ['/test/read', '/test/update', '/test/delete'],
    DanhSachLopHoc: ['/class/read', '/class/create', '/class/update', '/class/delete'],
    DanhSachLop: ['/classList/read', '/classList/addStudent', '/classList/removeStudent'],
    QuanLyKhoiLop: ['/classGrade/read', '/classGrade/update', '/classGrade/delete', '/classGrade/create'],
    BaoCaoMonHoc: ['/report/subject-report'],
    BaoCaoHocKy: ['/report/semester-report'],
    ThayDoiQuyDinh: ['/paramenter/read', '/paramenter/update'],
    QuanLyTaiKhoan: ['/user/read', '/user/create', '/user/update', '/user/delete'],
    QuanLyPhanQuyen: ['/group/read-for-admin' , '/group/create', 'permission/read','permission/assign'],
    QuanLyNamHoc: ['/year/paginated', '/year/create', '/year/update', '/year/delete'],
}
    
  useEffect(() => {
    if (user.account && user.account.groupWithPermissions) {
      setUserPermissions(user.account.groupWithPermissions.chucnangs.map(permission => permission.TenManHinhDuocLoad));
    }
  }, [user]);

  useEffect(() => {
    setIsAvailable({ // kiểm tra quyền của user để ẩn khỏi taskbar
      DanhSachHocSinh: userPermissions.some(permission => loadPage.DanhSachHocSinh.includes(permission)),
      TiepNhanHocSinh: userPermissions.some(permission => loadPage.TiepNhanHocSinh.includes(permission)),
      DanhSachMonHoc: userPermissions.some(permission => loadPage.DanhSachMonHoc.includes(permission)),
      BangDiemMonHoc: userPermissions.some(permission => loadPage.BangDiemMonHoc.includes(permission)),
      LoaiKiemTra: userPermissions.some(permission => loadPage.LoaiKiemTra.includes(permission)),
      QuanLyLopHoc: userPermissions.some(permission => loadPage.DanhSachLopHoc.includes(permission)),
      DanhSachLop: userPermissions.some(permission => loadPage.DanhSachLop.includes(permission)),
      QuanLyKhoiLop: userPermissions.some(permission => loadPage.QuanLyKhoiLop.includes(permission)),
      BaoCaoMonHoc: userPermissions.some(permission => loadPage.BaoCaoMonHoc.includes(permission)),
      BaoCaoHocKy: userPermissions.some(permission => loadPage.BaoCaoHocKy.includes(permission)),
      ThayDoiQuyDinh: userPermissions.some(permission => loadPage.ThayDoiQuyDinh.includes(permission)),
      QuanLyTaiKhoan: userPermissions.some(permission => loadPage.QuanLyTaiKhoan.includes(permission)),
      QuanLyPhanQuyen: userPermissions.some(permission => loadPage.QuanLyPhanQuyen.includes(permission)),
      QuanLyNamHoc: userPermissions.some(permission => loadPage.QuanLyNamHoc.includes(permission))
    })
  }, [userPermissions]);

  return (
    <UserContext.Provider value={{ user, loginContext, logoutContext, isAvailable }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };