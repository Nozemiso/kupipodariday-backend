import { OmitType } from '@nestjs/swagger';
import { UserDTO } from './user-dto.dto';

export class UserPublicDto extends OmitType(UserDTO, ['email']) {}
