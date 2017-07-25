import { Observable } from 'rxjs/Rx';
import { SlackMessage } from './Bot';
import * as Moment from 'moment';
import Message from './models/Message';

export default class MessageLogger {
  constructor(messageObservable: Observable<SlackMessage>) {
    messageObservable
      .subscribe(msg => this.handleNewMessage(msg))
  }

  private async handleNewMessage(message: SlackMessage) {
    const isFirstMessageOfDay = await this.isFirstMessageOfDay();

    if (!isFirstMessageOfDay) {
      return
    }

    this.saveMessage(message);
  }

  private async isFirstMessageOfDay(): Promise<boolean> {
    const today = Moment().startOf('day').unix();

    let todaysMessage = await Message
      .query()
      .where('timestamp', '>', today)
      .first();

    return todaysMessage === undefined;
  }

  private async saveMessage(message: SlackMessage) {
    let savedMessage = await Message
      .query()
      .insert({
        message: message.text,
        slackId: message.user,
        timestamp: message.ts,
      });
  }
}