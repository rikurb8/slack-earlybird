import MessageLogger from './MessageLogger';
import { Observable } from 'rxjs/Rx';
import * as slack from 'slack';

export interface SlackMessage {
  type: string;
  channel: string;
  user: string;
  text: string;
  ts: number;
  hidden?: boolean;
}

export default class Bot {
  private bot: any;
  private token: string;
  private logger: MessageLogger;

  constructor(token: string, messageLogger: MessageLogger) {
    this.token = token;

    this.bot = slack.rtm.client();
    this.bot.listen({ token });

    this.logger = messageLogger;
    this.logger.setMessageObservable(this.getMessageObservable());

    this.listenToCommands();
  }

  /**
   * listenToCommands
   */
  public listenToCommands() {
    this.getMessageObservable().subscribe(async (message: SlackMessage) => {
      switch (message.text) {
        case 'listing':
          this.sendMessage('Leader: Riku');
          break;
        case 'dump':
          const messages = await this.logger.getAllMessages();

          const joinedMessages = messages
            .map(msg => `${msg.timestamp};${msg.slackId};${msg.message}`)
            .join('\n');

          let csv = 'timestamp;user;message\n';
          csv += joinedMessages;

          this.sendSnippet(csv);
          break;
        default:
          break;
      }
    });
  }

  private getMessageObservable(): Observable<SlackMessage> {
    const observable = Observable.create(observer => {
      this.bot.message((message: SlackMessage) => {
        if (message.type === 'message' && !message.hidden) {
          observer.next(message);
        }
      });
    });

    return observable;
  }

  private sendSnippet(content: string) {
    slack.files.upload(
      {
        channels: 'tietokonekerho',
        content,
        title: ':neckbeard: :neckbeard: :neckbeard:',
        token: this.token,
      },
      (err, data) => {
        if (err) {
          console.log(`Error posting snippet, ${err}`);
        }
      }
    );
  }

  private sendMessage(message: string) {
    slack.chat.postMessage(
      {
        channel: 'tietokonekerho',
        text: message,
        token: this.token,
      },
      (err, data) => {
        if (err) {
          console.log(`Error posting listing, ${err}`);
        }
      }
    );
  }
}
