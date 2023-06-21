import { Injectable } from '@nestjs/common'
import { DataUtil, Util } from '@pnpm-workspace-starter/model'

@Injectable()
export class AppService {
  getHello(): string {
    return DataUtil.format(new Date(), 'dd/MM/yyyy')
  }
}
