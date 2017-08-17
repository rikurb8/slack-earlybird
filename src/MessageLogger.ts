import { Observable } from 'rxjs/Rx';
import { SlackMessage } from './Bot';
import * as Moment from 'moment';
import Message from './models/Message';

export default class MessageLogger {
  /**
   * setMessageObservable
   */
  public setMessageObservable(observable: Observable<SlackMessage>) {
    observable.subscribe(msg => this.handleNewMessage(msg));
  }

  /**
   * getAllMessages
   */
  public async getAllMessages(): Promise<string> {
    const messages = await Message.query();
    const joinedMessages = messages
    .map(msg => `${msg.timestamp};${msg.slackId};${msg.message}`)
    .join('\n');

    return 'timestamp;user;message\n' + joinedMessages;
  }

  private async handleNewMessage(message: SlackMessage) {
    const isFirstMessageOfDay = await this.isFirstMessageOfDay();

    if (!isFirstMessageOfDay) {
      return;
    }

    this.saveMessage(message);
  }

  private async isFirstMessageOfDay(): Promise<boolean> {
    const today = Moment().startOf('day').unix();

    const todaysMessage = await Message.query()
      .where('timestamp', '>', today)
      .first();

    return todaysMessage === undefined;
  }

  private async saveMessage(message: SlackMessage) {
    const savedMessage = await Message.query().insert({
      message: message.text,
      slackId: message.user,
      timestamp: Math.floor(message.ts),
    });
  }
}
