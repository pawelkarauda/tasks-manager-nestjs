import { TaskStatus } from '../taskStatus.enum';
import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';
import { TaskStatusValidationPipe } from '../pipes/taskStatusValidation.pipe';

export class GetTasksFilterDto {
  @IsOptional()
  @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
