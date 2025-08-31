export enum EventType {
  Select,
  Decision,
  Start,
  Typing,
  MissTyping,
  Completed,
}

export interface Event {
  type: EventType;
  payload?: Record<string, unknown>;
}
