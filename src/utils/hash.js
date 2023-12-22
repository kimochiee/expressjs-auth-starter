import crypto from 'crpyto';

export default (string) => {
  return crypto.createHash('md5').update(string).digest('hex');
};
