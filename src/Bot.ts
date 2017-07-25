import * as slack from 'slack';
import { Observable } from "rxjs/Rx";

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

  constructor(token: string) {
    this.bot = slack.rtm.client();
    this.token = token;

    this.bot.listen({token});
  }

  public getMessageObservable(): Observable<SlackMessage> {
    const observable = Observable.create(observer => {
      this.bot.message((message: SlackMessage) => {
        if (message.type === 'message' && !message.hidden) {
          observer.next(message);
        }
      });
    });

    return observable;
  }
}

