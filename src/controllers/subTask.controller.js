import model from "../database/models";

const Task = model.Task;
const SubTask = model.Subtask;

class SubTasks {
  static async createSubTask(req, res) {
    try {
      const { taskId} = req.params;
      const { title ,description} = req.body;
      const taskFound = await Task.findOne({
        where :{
          taskId
        }
      });
      if(!taskFound){
        return res.status(400).json({
          status:"fail",
          message : "Task not found"
        });
      }
      const subTask = await SubTask.findOne({
        where : {
          title
        }
      });
      if(subTask){
        return res.status(400).json({
          status:" fail ",
          message : "Sub Task already exists"
        });
      }
      const task = await SubTask.create({
        title,
        description,
        taskId
      });
      return res.status(201).json({
        status : "success",
        data: task
      });
    } catch (error) {
      return res.status(500).json({ status :"fail", error: error.message });
    }
  }
  static async getAllSubTasksForTasks( req, res){
    try {
      const { taskId } = req.params;
      const taskFound = await SubTask.findAll({
        where :{
          taskId
        },
        include: [
          {
            model: Task,
          },
        ]
      });
      return res.status(201).json({
        status : "success",
        data: taskFound
      });
    } catch (error) {
      return res.status(500).json({ status :"fail", error: error.message });
    }
  }
  static async completeSubTask(req, res) {
    try {
      const { subTaskId } = req.params;
      const task = await SubTask.findOne({
        where: {
          subTaskId,
          completed: false
        },
      });
      if (!task) {
        return res.status(404).json({
          status: "fail",
          message: "SubTask not found or is already complete",
        });
      }
      await task.update({
        completed: true,
      });
      const allSubTasksCompleted = await SubTask.findAll({
        where: {
          taskId: task.Task.taskId,
          completed: false,
        },
      });

      if (allSubTasksCompleted.length === 0) {
        await Task.update(
          { completed: true },
          { where: { taskId: task.Task.taskId } }
        );
      }
      return res.status(200).json({
        status: "success",
        data: task,
      });
    } catch (error) {
      return res.status(500).json({ status: "fail", error: error.message });
    }
  }
  static async updateSubTask(req, res) {
    try {
      const { subTaskId } = req.params;
      const { title, description } = req.body;
      const subTask = await SubTask.findOne({
        where: {
          subTaskId,
          completed: false,
        },
      });

      if (!subTask) {
        return res.status(404).json({
          status: "fail",
          message: "SubTask not found or is already completed",
        });
      }
      if (title) {
        subTask.title = title;
      }

      if (description) {
        subTask.description = description;
      }
      await subTask.save();
      return res.status(200).json({
        status: "success",
        data: subTask,
      });
    } catch (error) {
      return res.status(500).json({ status: "fail", error: error.message });
    }
  }
  static async deleteSubTask(req, res) {
    try {
      const { subTaskId } = req.params;
      const subTask = await SubTask.findOne({
        where: {
          subTaskId,
          completed: false,
        },
      });

      if (!subTask) {
        return res.status(404).json({
          status: "fail",
          message: "SubTask not found or is already completed",
        });
      }
      await subTask.destroy();
      return res.status(200).json({
        status: "success",
        message: "SubTask deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({ status: "fail", error: error.message });
    }
  }
  static async getOneSubTask(req, res) {
    try {
      const { subTaskId } = req.params;
      const { userId } = req.user;
      const subTask = await SubTask.findOne({
        where: {
          subTaskId,
          completed: false,
        },
        include: [
          {
            model: Task,
          },
        ],
      });

      if (!subTask) {
        return res.status(404).json({
          status: "fail",
          message: "SubTask not found or is already completed",
        });
      }
      if (subTask.Task.userId !== userId) {
        return res.status(403).json({
          status: "fail",
          message: "You do not have permission to access this SubTask",
        });
      }

      return res.status(200).json({
        status: "success",
        data: subTask,
      });
    } catch (error) {
      return res.status(500).json({ status: "fail", error: error.message });
    }
  }
  static async getAllSubTasksForUser(req, res) {
    try {
      const { userId } = req.user;
      const subTasks = await SubTask.findAll({
        include: [
          {
            model: Task,
            where: {
              userId,
            },
          },
        ],
      });
      return res.status(200).json({
        status: "success",
        data: subTasks,
      });
    } catch (error) {
      return res.status(500).json({ status: "fail", error: error.message });
    }
  }
}
export default SubTasks;
