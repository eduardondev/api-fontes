export function responseAPI(
  error: boolean,
  message: string,
  content?: object | string
) {
  return {
    error,
    message,
    content,
  };
}
