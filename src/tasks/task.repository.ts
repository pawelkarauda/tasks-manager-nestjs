import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/createTask.dto';
import { TaskStatus } from './taskStatus.enum';
import { GetTasksFilterDto } from './dto/getTasksFilter.dto';
import { User } from 'src/auth/user.entity';
import { Logger, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger();
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }
    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (err) {
      this.logger.error(
        `Failed to get tasks for user ${
          user.username
        }, Filters: ${JSON.stringify(filterDto)}`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = new Task();
    const { title, description } = createTaskDto;
    task.user = user;
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;

    try {
      await task.save();
    } catch (err) {
      this.logger.error(
        `Failed to create a task by user ${
          user.username
        }, Data: ${JSON.stringify(createTaskDto)}`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
    delete task.user;
    return task;
  }
}
