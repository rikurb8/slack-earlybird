import { Model } from 'objection';

export default class Message {
  readonly id: number;
  slackId: string;
  message: string;
  timestamp: number;

  static tableName = 'Message';

  static jsonSchema = {
    id: { type: 'integer' },
    message: { type: 'string' },
    timestamp: { type: 'float' },
  }

  static modelPaths = [__dirname];
}