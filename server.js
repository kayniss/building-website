const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const createError = require('http-errors');

const FeedbackService = require('./services/FeedbackService');
const SpeakersService = require('./services/SpeakerService');

const feedbackService = new FeedbackService('./data/feedback.json');
const speakersService = new SpeakersService('./data/speakers.json');

const routes = require('./routes');
const { response } = require('express');
const res = require('express/lib/response');
const { create } = require('domain');

const app = express();

const port = 3000;

app.set('trust proxy', 1);

app.use(
  cookieSession({
    name: 'session',
    keys: ['asdfasdfassdfa', 'rewqdfsaweq'],
  })
);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.locals.siteName = 'ROUX Meetups';

app.use(express.static(path.join(__dirname, './static')));

app.get('/throw', (request, response, next) => {
  throw new Error('Something went wrong');
});

app.use(async (request, response, next) => {
  const names = await speakersService.getNames();
  response.locals.speakerNames = names;
  return next();
});

app.use(
  '/',
  routes({
    feedbackService,
    speakersService,
  })
);

app.use((request, response, next) => next(createError(404, 'File not Found')));

app.use((err, request, response, next) => {
  response.locals.message = err.message;
  console.error(err);
  const status = err.status || 500;
  response.locals.status = status;
  response.status(status);
  response.render('error');
});

app.listen(port, () => {
  console.log(`Express server listening on ${port}`);
});
