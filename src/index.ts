import Bot from './Bot';
import MessageLogger from './MessageLogger';
import * as Knex from 'knex';
import { Model } from 'objection';

const TOKEN = process.env.SLACKBOT_TOKEN;

if (!TOKEN) {
  throw new Error('Please add a SLACKBOT_TOKEN env variable');
}

const knexConfig = require('../knexfile');
const knex = Knex(knexConfig.development);
knex.migrate.latest();
Model.knex(knex);

let messageLogger = new MessageLogger();
let bot = new Bot(TOKEN, messageLogger);

