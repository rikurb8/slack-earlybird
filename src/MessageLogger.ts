import { Observable } from "rxjs/Rx";

export default class MessageLogger {
  constructor(messageObservable: Observable<object>) {
    messageObservable
      .subscribe(msg => this.handleNewMessage(msg))
  }

  private handleNewMessage(message: object) {
    console.log('logger', message);
  }
}