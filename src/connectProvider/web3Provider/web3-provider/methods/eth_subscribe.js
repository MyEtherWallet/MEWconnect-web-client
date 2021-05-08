/* eslint-disable */

// Only for Http
export default async ({ payload, store }, res, next) => {
  if (payload.method !== 'eth_subscribe') return next();
};
