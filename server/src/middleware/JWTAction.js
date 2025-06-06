import jwt from "jsonwebtoken";
require("dotenv").config();

const nonSecurePaths = ["/logout", "/login"];

const createJWT = (payload) => {
  let key = process.env.JWT_SECRET;
  let token = null;
  try {
    token = jwt.sign(payload, key, { expiresIn: process.env.JWT_EXPIRES_IN }); //60 ms
  } catch (err) {
    console.log(err);
  }
  return token;
};

const verifyToken = (token) => {
  let key = process.env.JWT_SECRET;
  let decoded = null;
  try {
    decoded = jwt.verify(token, key);
  } catch (err) {
    console.log(err);
  }
  return decoded;
};

function extractToken(req) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
}

const checkUserJWT = (req, res, next) => {
  if (nonSecurePaths.includes(req.path)) return next();
  let cookies = req.cookies;
  let tokenFromHeader = extractToken(req);
  if ((cookies && cookies.jwt) || tokenFromHeader) {
    let token = cookies&& cookies.jwt ? cookies.jwt : tokenFromHeader;
    let decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
      req.token = token;
      next();
    } else {
      return res.status(401).json({
        EM: "Not authenticated the user",
        EC: -1,
        DT: "",
      });
    }
  }else {
    return res.status(401).json({
      EM: "Not authenticated the user",
      EC: -1,
      DT: "",
    });
  }
};

const checkUserPermission = (req, res, next) => {
  
  if (nonSecurePaths.includes(req.path) || req.path === "/account" || req.path ==="/year/read" 
  || req.path ==="/test/read" || req.path ==="/report/options" || req.path === "/classGrade/read" || req.path ==="/group/read" )
    return next();
  if (req.user) {
    let roles = req.user.groupWithRoles.chucnangs;
    console.log("check roles", roles);
    let currentUrl = req.path;
    if (!roles && roles.length === 0) {
      return res.status(403).json({
        EM: "You don't have permission to access this resource...",
        EC: -1,
        DT: "",
      });
    }
    let canAccess = roles.some((item) => item.TenManHinhDuocLoad === currentUrl || currentUrl.includes(item.TenManHinhDuocLoad)); //currentUrl bao gồm url đã có dưới database thì pass
    if (canAccess === true) {
      next();
    } else {
      return res.status(403).json({
        EM: "You don't have permission to access this resource...",
        EC: -1,
        DT: "",
      });
    }
  } else {
    return res.status(401).json({
      EM: "Not authenticated the user",
      EC: -1,
      DT: "",
    });
  }
};

module.exports = {
  createJWT,
  verifyToken,
  checkUserJWT,
  checkUserPermission,
};
