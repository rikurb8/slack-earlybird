import Bot from './Bot';
import MessageLogger from './MessageLogger';
import * as Knex from 'knex';
import { Model } from 'objection';
import * as express from 'express';

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

const app = express();

app.get('/dump', async (req, res) => {
  const dump = await messageLogger.getAllMessages();

  res.setHeader('Content-Type', 'text/csv');
  res.send(dump);
});

const server = app.listen(process.env.PORT || 6660, function() {
    console.log(
      `express up and running, port: ${server.address().port}`
    );
});


console.log(`Initializating complete, posting to channel ${CHANNEL}..`);
