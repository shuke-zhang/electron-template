import JSEncrypt from 'jsencrypt/bin/jsencrypt.min';

const publicKeyPassword = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuKCSfQtOhX6g/OLy7Yqn
6f5om238cTfQuIyn09nwv7BX0Exxq/M7IzJ6k44r1T6iv/FvIhmBnlYYijID9a43
fSvwkBRmb8x0c/nSc4cAKrjObxYwSxExwki/ZTmp7FlFwIxh4vIdmJlAzh+dQeh+
u9dD67rqvTOfCyWrsdtaVw1zkrvbIoGR9RA422ar6cCmtgP/C0WrXS5aVXnposTu
X6bnodGSHeZ8r1W0yEk0e7HnrkZXQ06LzfLQF/4iuA+M4mSNtrWN5Xwi4uGvWxmt
EOixt2spvdlcfNba8JlzxZyGnG8vZMOnaRmYW8tbprHjd7Yv5C7Cclj/YwPMUSd6
awIDAQAB`;
// 加密
export function encryptPassword(txt: string) {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKeyPassword); // 设置公钥
  return encryptor.encrypt(txt); // 对数据进行加密
}
