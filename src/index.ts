import Bot from './Bot';
import MessageLogger from './MessageLogger';
import * as Knex from 'knex';
import { Model } from 'objection';

const TOKEN = process.env.SLACKBOT_TOKEN;

if (!TOKEN) {
  throw new Error('Please add a SLACKBOT_TOKEN env variable');
}

const knexConfig = require('../knexfile');
const env = process.env.NODE_ENV || 'development';
const knex = Knex(knexConfig[env]);

knex.migrate.latest().catch(() => {
  // FIXME: definetly not the best option but we need to wait a while for
  // for the DB to be ready, crash and retry if not
  process.exit(1);
});

Model.knex(knex);

let messageLogger = new MessageLogger();
let bot = new Bot(TOKEN, messageLogger);

console.log('Initialization complete, listening..');

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
