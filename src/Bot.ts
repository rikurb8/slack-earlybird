import * as slack from 'slack';
import { Observable } from "rxjs/Rx";

export default class Bot {
  private bot: any;
  private token: string;

  constructor(token: string) {
    this.bot = slack.rtm.client();
    this.token = token;

    this.bot.listen({token});
  }

  public getMessageObservable(): Observable<object> {
    const observable = Observable.create(observer => {
      this.bot.message(message => observer.next(message));
    });

    return observable;
  }
}

