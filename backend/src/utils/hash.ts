import crypto from 'crypto';

export function hashpassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
    return { salt, hash };

}

export function verifyPassword({
    condidatepassword,
    salt,
    hash,
}: {
    condidatepassword: string;
    salt: string;
    hash: string;
}) {
    const condidatehash = crypto
    .pbkdf2Sync(condidatepassword, salt, 1000, 64, 'sha512')
    .toString('hex');
    return condidatehash === hash;
  
}