import React, { useState, useEffect } from 'react'
import { getUserAccount } from '../services/userServices'

const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const userDefault = {
    isAuthenticated:false,
    isLoading:true,
    token:"",
    account:{}
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
      let groupWithRoles = response.data.DT.groupWithRoles;
       let username = response.data.DT.username;
      let token = response.data.DT.access_token;
      let data = {
        isAuthenticated:true,
        token: token, 
       account: { groupWithRoles, username },
      }
      setUser(data)
    }else{
      setUser({...userDefault, isLoading: false})
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
 


  return (
    <UserContext.Provider value={{ user, loginContext, logoutContext }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };