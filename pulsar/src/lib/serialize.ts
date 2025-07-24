export const serialize = <T>(message: T): Buffer => {
  return Buffer.from(JSON.stringify(message));
};

export const deserialize = <T>(message: Buffer): T => {
  return JSON.parse(message.toString());
};
