const express = require('express');

const router = express.Router();

module.exports = (params) => {
  const { feedbackService } = params;

  // eslint-disable-next-line arrow-body-style
  router.get('/', async (request, response, next) => {
    try {
      const feedback = await feedbackService.getList();
      return response.render('layout', {
        pageTitle: 'Feedback',
        template: 'feedback',
        feedback,
      });
    } catch (err) {
      return next(err);
    }
  });

  // eslint-disable-next-line arrow-body-style
  router.post('/', (request, response) => {
    return response.send('Feedback form posted');
  });

  return router;
};
