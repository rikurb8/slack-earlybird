import * as slack from 'slack';
import { Observable } from "rxjs/Rx";
import MessageLogger from './MessageLogger';

export interface SlackMessage {
  type: string,
  channel: string,
  user: string,
  text: string,
  ts: number,
  hidden?: boolean,
}

export default class Bot {
  private bot: any;
  private token: string;
  private logger: MessageLogger;

  constructor(token: string, messageLogger: MessageLogger) {
    this.token = token;

    this.bot = slack.rtm.client();
    this.bot.listen({token});

    this.logger = messageLogger;
    this.logger.setMessageObservable(this.getMessageObservable());

    this.listenToCommands();
  }

  private getMessageObservable(): Observable<SlackMessage> {
    const observable = Observable.create(observer => {
      this.bot.message((message: SlackMessage) => {
        if (message.type === 'message' && !message.hidden) {
          observer.next(message);
        }
      });
    });

    return observable;
  }

  /**
   * listenToCommands
   */
  public listenToCommands() {
    this.getMessageObservable()
      .subscribe(async (message: SlackMessage) => {
        switch (message.text) {
          case 'listing':
            this.sendMessage('Leader: Riku');
            break;
          case 'dump':
            const messages = await this.logger
              .getAllMessages();

            const joinedMessages = messages
              .map(msg => `${msg.timestamp};${msg.slackId};${msg.message}`)
              .join('\n')

            let csv = "timestamp;user;message\n";
            csv += joinedMessages;

            this.sendSnippet(csv);
            break;
          default:
            break;
        }
      })
  }

  private sendSnippet(content: string) {
    slack.files.upload({
      token: this.token,
      content: content,
      channels: 'tietokonekerho',
      title: ':neckbeard: :neckbeard: :neckbeard:'
    }, (err, data) => {
      if (err) {
        console.log(`Error posting snippet, ${err}`);
      }
    });
  }

  private sendMessage(message: string) {
    slack.chat.postMessage({
      token: this.token,
      channel: 'tietokonekerho',
      text: message
    }, (err, data) => {
      if (err) {
        console.log(`Error posting listing, ${err}`);
      }
      });
  }
}

