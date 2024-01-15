import { PartialType } from '@nestjs/swagger';
import { UpdatePutUserDTO } from './update-put-user.dto';

export class UpdatePatchUserDTO extends PartialType(UpdatePutUserDTO) {}
