export interface IMessageContent {
  id: string;
  user: string;
  text: string;
  time: string;
}

export interface IMessage {
  createdAt: string;
  id: string;
  text: string;
  time: string;
  user: string;
}

export interface IRoom {
  createdAt: string;
  id: string;
  messages: IMessage[];
  name: string;
}
