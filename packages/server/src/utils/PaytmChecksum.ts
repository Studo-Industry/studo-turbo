import crypto from 'crypto';

export default class PaytmChecksum {
  static iv = '@@@@&&&&####$$$$';

  static async encrypt(input: string, key: string): Promise<string> {
    const cipher = crypto.createCipheriv('AES-128-CBC', key, PaytmChecksum.iv);
    let encrypted = cipher.update(input, 'binary', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  }

  static decrypt(encrypted: string, key: string) {
    const decipher = crypto.createDecipheriv(
      'AES-128-CBC',
      key,
      PaytmChecksum.iv,
    );
    let decrypted = decipher.update(encrypted, 'base64', 'binary');
    try {
      decrypted += decipher.final('binary');
    } catch (e) {
      console.log(e);
    }
    return decrypted;
  }

  static generateSignature(
    params: { [key: string]: any } | string,
    key: string,
  ) {
    if (typeof params !== 'object' && typeof params !== 'string') {
      const error = 'string or object expected, ' + typeof params + ' given.';
      return Promise.reject(error);
    }
    if (typeof params !== 'string') {
      params = PaytmChecksum.getStringByParams(params);
    }
    return PaytmChecksum.generateSignatureByString(params, key);
  }

  static verifySignature(
    params: { [key: string]: any } | string,
    key: string,
    checksum: string,
  ) {
    if (typeof params !== 'object' && typeof params !== 'string') {
      const error = 'string or object expected, ' + typeof params + ' given.';
      return Promise.reject(error);
    }
    if (typeof params !== 'string') {
      params = PaytmChecksum.getStringByParams(params);
    }
    return PaytmChecksum.verifySignatureByString(params, key, checksum);
  }

  static async generateSignatureByString(
    params: string,
    key: string,
  ): Promise<string> {
    const salt = await PaytmChecksum.generateRandomString(4);
    return PaytmChecksum.calculateChecksum(params, key, salt);
  }

  static verifySignatureByString(
    params: string,
    key: string,
    checksum: string,
  ): boolean {
    const paytm_hash = PaytmChecksum.decrypt(checksum, key);
    const salt = paytm_hash.substr(paytm_hash.length - 4);
    return paytm_hash === PaytmChecksum.calculateHash(params, salt);
  }

  static generateRandomString(length: number): Promise<string> {
    return new Promise(function (resolve, reject) {
      crypto.randomBytes((length * 3.0) / 4.0, function (err, buf) {
        if (!err) {
          const salt = buf.toString('base64');
          resolve(salt);
        } else {
          console.log('error occurred in generateRandomString: ' + err);
          reject(err);
        }
      });
    });
  }

  static getStringByParams(params: { [key: string]: any }): string {
    const data: { [key: string]: any } = {};
    Object.keys(params)
      .sort()
      .forEach(function (key) {
        data[key] =
          params[key] !== null && params[key].toLowerCase() !== null
            ? params[key]
            : '';
      });
    return Object.values(data).join('|');
  }

  static calculateHash(params: string, salt: string) {
    const finalString = params + '|' + salt;
    return crypto.createHash('sha256').update(finalString).digest('hex') + salt;
  }

  static calculateChecksum(params: string, key: string, salt: string) {
    const hashString = PaytmChecksum.calculateHash(params, salt);
    const result = PaytmChecksum.encrypt(hashString, key);
    return result;
  }
}
