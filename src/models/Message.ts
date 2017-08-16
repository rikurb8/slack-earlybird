import { Model } from 'objection';

export default class Message extends Model {
  readonly id: number;
  slackId: string;
  message: string;
  timestamp: number;

  static tableName = 'Message';

  static jsonSchema = {
    type: 'object',
    required: ['message', 'timestamp'],

    properties: {
      id: { type: 'integer' },
      message: { type: 'string' },
      timestamp: { type: 'float' },
    },
  };

  static modelPaths = [__dirname];
}
