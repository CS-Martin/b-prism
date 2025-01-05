import { ActivityLogDto, CreateActivityLogDto, ResponseDto } from '@dto';
import { ActivityLog } from '@prisma/client';

export abstract class ActivityLogServiceAbstractClass {
    abstract create(action: string, description: string, user_id: string): Promise<ResponseDto<ActivityLog>>;

    abstract findAll(): Promise<ResponseDto<ActivityLog[]>>;

    abstract convertToDto(activityLog: ActivityLog): ActivityLogDto;
}
