const morgan = require('morgan');

function errorHandler(error, _req, res, next) {
  console.error(error);
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  next(error);
}

function unknownEndpoint(_req, res) {
  res.status(404).json({ error: 'unknown endpoint' });
}

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :body'
);

module.exports = {
  errorHandler,
  unknownEndpoint,
  requestLogger,
};
