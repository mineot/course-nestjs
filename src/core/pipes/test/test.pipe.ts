import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TestPipe implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata) {
    console.log(metadata);
    return value;
  }
}
