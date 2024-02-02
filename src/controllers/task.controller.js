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
  static async completeTask(req, res) {
    try {
      const { taskId } = req.params;
      const { userId } = req.user;
      const task = await Task.findOne({
        where: {
          taskId,
          userId,
        },
      });
      if (!task) {
        return res.status(404).json({
          status: "fail",
          message: "Task not found or does not belong to the authenticated user",
        });
      }
      await task.update({
        completed: true,
      });
  
      return res.status(200).json({
        status: "success",
        data: task,
      });
    } catch (error) {
      return res.status(500).json({ status: "fail", error: error.message });
    }
  }
  static async updateTask(req, res) {
    try {
      const { taskId } = req.params;
      const { title, description } = req.body;
      const { userId } = req.user;

      const task = await Task.findOne({
        where: {
          taskId,
          userId
        },
      });

      if (!task) {
        return res.status(404).json({
          status: "fail",
          message: "Task not found or does not belong to the authenticated user",
        });
      }
      if (task.completed === true) {
        return res.status(404).json({
          status: "fail",
          message: "Task cannot be updated it has been completed",
        });
      }
      if (title) { 
        task.title = title;
      }

      if (description) {
        task.description = description;
      }
      await task.save();
      return res.status(200).json({
        status: "success",
        data: task,
      });
    } catch (error) {
      return res.status(500).json({ status: "fail", error: error.message });
    }
  }

  static async deleteTask(req, res) {
    try {
      const { taskId } = req.params;
      const { userId } = req.user;
      const task = await Task.findOne({
        where: {
          taskId,
          userId
        },
      });

      if (!task) {
        return res.status(404).json({
          status: "fail",
          message: "Task not found or does not belong to the authenticated user",
        });
      }

      await task.destroy();
      return res.status(200).json({
        status: "success",
        message: "Task deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({ status: "fail", error: error.message });
    }
  }

  static async getOneTask(req, res) {
    try {
      const { taskId } = req.params;
      const { userId } = req.user;
      const task = await Task.findOne({
        where: {
          taskId,
          userId
        },
        include: [
          {
            model: User,
            attributes: ['userId', 'username', 'email'],
          },
        ],
      });

      if (!task) {
        return res.status(404).json({
          status: "fail",
          message: "Task not found or does not belong to the authenticated user",
        });
      }

      return res.status(200).json({
        status: "success",
        data: task,
      });
    } catch (error) {
      return res.status(500).json({ status: "fail", error: error.message });
    }
  }
  static async getCompletionSummaryForDay(req, res) {
    try {
      const { userId } = req.user;
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({
          status: "fail",
          message: "Date parameter is required.",
        });
      }
      const tasksForDay = await Task.findAll({
        where: {
          userId,
          createdAt: {
            $gte: new Date(`${date  }T00:00:00Z`),
            $lte: new Date(`${date  }T23:59:59Z`),
          },
        },
        include: [
          {
            model: User,
            attributes: ['userId', 'username', 'email'],
          },
        ],
      });

      const completionSummary = {
        totalTasks: tasksForDay.length,
        completedTasks: tasksForDay.filter(task => task.completed).length,
        incompleteTasks: tasksForDay.filter(task => !task.completed).length,
      };

      return res.status(200).json({
        status: "success",
        data: completionSummary,
      });
    } catch (error) {
      return res.status(500).json({ status: "fail", error: error.message });
    }
  }
}
export default Tasks;
