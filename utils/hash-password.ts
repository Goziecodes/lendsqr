import crypto from 'crypto';

export default (inputString: string) => crypto.createHash('sha256').update(inputString).digest('hex');