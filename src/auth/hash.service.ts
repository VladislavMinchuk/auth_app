import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async getHash(payload: string): Promise<string> {
    try {
      return await bcrypt.hash(payload, parseInt(process.env.ROUND));
    } catch (error) {
      console.log(error);
    }
  }
  
  async compareHash(payload: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(payload || '', hash || '');
  }
}
