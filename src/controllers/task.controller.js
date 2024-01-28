import model from "../database/models";

const Task = model.Task;
const User = model.User;

class Tasks {
  static async createTask(req, res) {
    try {
      const { title ,description} = req.body;
      const taskFound = await Task.findOne({
        where :{
          title
        }
      });
      if(taskFound){
        return res.status(400).json({
          status:"fail",
          message : "Task already exists"
        });
      }
      const task = await Task.create({
        title,
        description,
        userId : req.user.userId
      });
      return res.status(201).json({
        status : "success",
        data: task
      });
    } catch (error) {
      return res.status(500).json({ status :"fail", error: error.message });
    }
  }
  static async getAllTasksByUser( req, res){
    try {
      const { userId} = req.user;
      const taskFound = await Task.findAll({
        where :{
          userId
        },
        include: [
          {
            model: User,
            attributes: ['userId', 'username', 'email'],
          },]
      });
      return res.status(201).json({
        status : "success",
        data: taskFound
      });
    } catch (error) {
      return res.status(500).json({ status :"fail", error: error.message });
    }
  }
}
export default Tasks;
