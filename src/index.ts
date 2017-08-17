import Bot from './Bot';
import MessageLogger from './MessageLogger';
import * as Knex from 'knex';
import { Model } from 'objection';

const TOKEN = process.env.SLACKBOT_TOKEN;
const CHANNEL = process.env.CHANNEL;

if (!TOKEN) {
  throw new Error('Please add a SLACKBOT_TOKEN env variable');
}

if (!CHANNEL) {
  throw new Error('Please add a CHANNEL env variable');
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

const messageLogger = new MessageLogger();
const bot = new Bot(TOKEN, messageLogger, CHANNEL);

console.log(`Initializating complete, posting to channel ${CHANNEL}..`);
