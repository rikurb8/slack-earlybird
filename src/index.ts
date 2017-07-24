import Bot from './Bot';
import MessageLogger from './MessageLogger';

const TOKEN = process.env.SLACKBOT_TOKEN;

if (!TOKEN) {
  throw new Error('Please add a SLACKBOT_TOKEN env variable');
}

let bot = new Bot(TOKEN);

let messageLogger = new MessageLogger(bot.getMessageObservable());
