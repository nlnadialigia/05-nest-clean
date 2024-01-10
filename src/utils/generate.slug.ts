import {Injectable} from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class RandomTextService {
  generateRandomText(): string {
    const randomBytes = crypto.randomBytes(2);
    const randomHex = randomBytes.toString('hex');
    const randomText = randomHex.substring(0, 4);

    return randomText;
  }
}
