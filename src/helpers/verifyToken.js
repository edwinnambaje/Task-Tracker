import { Jwt } from "./jwt";
import model from "../database/models";

const users = model.User;


async function isAuthenticated (req, res, next) {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res
        .status(401)
        .json({ status: 'fail', message: 'Missing Authentication Token' });
    }
    const token = authorization.split(' ')[1];
    if (!token) {
      return res
        .status(401)
        .json({ status: 'fail', message: 'Missing Authentication Token' });
    }
    const decodedToken = Jwt.verifyToken(token);
    const { email } = decodedToken.value;
    const user = await users.findOne({
      where: { email }
    });
    if (!user) {
      return res
        .status(401)
        .json({ status: 'fail', message: 'Unauthorized Access' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'fail',
      message: err.message
    });
  }
}

export default isAuthenticated;
