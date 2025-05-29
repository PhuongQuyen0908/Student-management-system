const getUserAccount = async (req, res) =>{


  return res.status(200).json({
    EM: "ok", 
    EC: "0", //error code
    DT: {
      access_token:req.token,
      groupWithRoles:req.user.groupWithRoles,
      username:req.user.username    
    }
  }); 
}

module.exports = {
  getUserAccount
};
