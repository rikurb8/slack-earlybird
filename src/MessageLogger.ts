import { Observable } from 'rxjs/Rx';
import { SlackMessage } from './Bot';
import * as Moment from 'moment';
import Message from './models/Message';
import * as AsciiTable from 'ascii-table';

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

  /**
   * getTopListing
   */
  public async getTopListing(): Promise<string> {
    const groupedByMessage = await Message.query()
      .select('slackId')
      .count('slackId')
      .groupBy('slackId');

    const table = new AsciiTable('Ranking');
    table.setHeading('Count', 'User');

    groupedByMessage.forEach(group => {
      table.addRow(group.count, group.slackId);
    });

    return table.toString();
  }

  private async handleNewMessage(message: SlackMessage) {
    if (!this.isValidFirstMessage(message.text)) {
      return;
    }

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

  private isValidFirstMessage(message: string): boolean {
    // TODO: move valid greetings to a config file for easier configuration
    const validFirstMessages = ['huomenta'];

    let validMessageFound = false;
    validFirstMessages.forEach(validMessage => {
      if (validMessage === message.toLowerCase()) {
        validMessageFound = true;
      }
    });

    return validMessageFound;
  }

  private async saveMessage(message: SlackMessage) {
    const savedMessage = await Message.query().insert({
      message: message.text,
      slackId: message.user,
      timestamp: Math.floor(message.ts),
    });
  }
}
