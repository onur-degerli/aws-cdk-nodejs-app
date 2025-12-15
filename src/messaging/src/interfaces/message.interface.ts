export interface Message<T = unknown> {
  id?: string;
  timestamp: number;
  payload: T;
}
