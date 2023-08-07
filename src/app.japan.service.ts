import { Injectable ,Inject} from '@nestjs/common';

@Injectable()
export class AppJapanService {
    constructor(
        @Inject('APP_NAME')
        private readonly name:string,
        @Inject('MESSAGE')
        private readonly massage:string
      ){}
    
  getHello(): string {
    console.log(process.env.DB_HOST);
    return `こんにちは世界! from ${this.name},${this.massage}`;
  }
}
