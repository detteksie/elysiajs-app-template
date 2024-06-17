export interface SuccessJson<T = any> {
  status: string;
  result: T;
}

export function successJson<T>(data: T): SuccessJson<T> {
  return {
    status: 'success',
    result: data,
  };
}

export function errorJson<T extends Error>(err: T) {
  return {
    status: 'error',
    name: err.name,
    message: err.message,
    ...(Bun.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  };
}
