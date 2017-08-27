import MessageLogger from './MessageLogger';
import { Observable } from 'rxjs/Rx';
import * as slack from 'slack';
import * as Moment from 'moment';

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
  private channel: string;

  constructor(token: string, messageLogger: MessageLogger, channel: string) {
    // FIXME: bit of a dummy place to but this here, but good enough for now
    const listenToDisconnect = () => {
      this.bot.ws.on('close', (code, reason) => {
        console.log(`${Moment().toISOString} - Had to reset the connection`);
        this.bot.listen({ token: this.token }, listenToDisconnect);
      });
    };

    this.token = token;
    this.channel = channel;
    this.bot = slack.rtm.client();
    this.bot.listen({ token }, listenToDisconnect);

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
          this.sendMessage(`\`\`\`${await this.logger.getTopListing()}\`\`\``);
          break;
        case 'dump':
          this.sendSnippet(await this.logger.getAllMessages());
          break;
        default:
          break;
      }
    });
  }

  private getMessageObservable(): Observable<SlackMessage> {
    const observable = Observable.create(observer => {
      this.bot.message((message: SlackMessage) => {
        if (
          message.channel === this.channel &&
          message.type === 'message' &&
          !message.hidden
        ) {
          observer.next(message);
        }
      });
    });

    return observable;
  }

  private sendSnippet(content: string) {
    slack.files.upload(
      {
        channels: this.channel,
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
        channel: this.channel,
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
