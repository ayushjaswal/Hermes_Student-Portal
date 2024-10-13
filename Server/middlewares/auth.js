import jwt from "jsonwebtoken";

const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;

//Middleware to authorize api requests with a vaild jwt token.
//This checks whether the secret key matches and passes on the request to next method
//A token is valid only till 60 days. Thus we need to make a new API that refreshes the token. That is for some other time.
export const authorization = (req, res, next) => {
  // console.log(req.cookies)
  // const token = req.headers?.cookie?.split("=")[1];
  const { token } = req.cookies;
  if (!token) {
    return res.status(400).json({ error: "No token provided" });
  }
  jwt.verify(token, jwtPrivateKey, (err, data) => {
    if (err) {
      return res.status(400).json({ error: "Authorization Failed" });
    }
    req.token = token;
    next();
  });
};
