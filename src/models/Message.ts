import { Model } from 'objection';

export default class Message extends Model {
  public readonly id: number;
  public slackId: string;
  public message: string;
  public timestamp: number;
  public count?: string;

  public static tableName = 'Message';

  public static jsonSchema = {
    type: 'object',
    required: ['message', 'timestamp'],

    properties: {
      id: { type: 'integer' },
      message: { type: 'string' },
      timestamp: { type: 'integer' },
    },
  };

  public static modelPaths = [__dirname];
}
