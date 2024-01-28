import bcrypt from 'bcrypt';
import model from "../database/models";

const users = model.User;
import dotenv from 'dotenv';

dotenv.config();

const saltRounds = Number(process.env.SALTROUNDS);
class User {
  static async register(data) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/;
    if (!passwordRegex.test(data.password)) {
      return {
        message:
            'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@#$%^&+=)',
      };
    }
    data.password = await bcrypt.hash(data.password, saltRounds);
    const { username, email, password } = data;
    if( ! username || ! email || ! password ){
      return { message : 'All fields are required'};
    }
    if (email) {
      const emailUser = await users.findOne({
        where: {
          email
        }
      });
      if (emailUser) {
        return { message: 'Email already exists' };
      }
    }
    const user = await users.create({
      username,
      email,
      password
    });
    return { data: user };
  }
  static async getAllUsers() {
    const allUsers = await users.findAll();
  
    return allUsers;
  }

  static async getUserById(userId) {
    const user = await users.findOne({
      where: { userId }
    });
    return user;
  }
}
export default User;
