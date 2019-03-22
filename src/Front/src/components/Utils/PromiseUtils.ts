export function sleep(timeout) {
  return new Promise(accept => setTimeout(accept, timeout));
}
