import bcrypt from "bcrypt";
import model from "../database/models";
import User from "../services/user.service";
import { Jwt } from "../helpers/jwt";

const user = model.User;

class Users {
  static async register(req, res) {
    try {
      const { data, message } = await User.register(req.body);
      if (message) {
        return res.status(400).json({
          status: "fail",
          message
        });
      }
      return res.status(200).json({
        status: "success",
        data
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        error: error.message
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const users = await user.findOne({
      });

      if (!users) {
        return res.status(404).json({ status: "fail", message: "Account does not exist" });
      }

      const isPasswordValid = await bcrypt.compare(password, users.password);
      if (!isPasswordValid) {
        return res.status(400).json({ status: "fail", message: "Incorrect Credentials" });
      }
      const token = Jwt.generateToken({
        phoneNumber: users.phoneNumber,
        userId: users.userId,
        username: users.username,
        email: users.email,
      });
      return res.status(200).json({
        status: "success",
        data: {
          email,
          token,
          message: "Login Successful"
        }
      });
    } catch (error) {
      console.log("Error on logging in user: ", error);
      return res.status(500).json({ status: "error", error: error.message });
    }
  }
}
export default Users;
