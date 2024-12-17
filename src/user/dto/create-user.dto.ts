import { Transform } from "class-transformer";
import { IsString } from "class-validator";

export class CreateUserDto {

  @IsString()
  @Transform(({value}) => value.trim())
  firstName: string;

  @IsString()
  @Transform(({value}) => value.trim())
  lastName: string;

  @IsString()
  @Transform(({value}) => value.trim())
  email: string;

  @IsString()
  @Transform(({value}) => value.trim())
  password: string;
}
