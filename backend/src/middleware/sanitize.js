const sanitizeHtml = require('sanitize-html');

const defaultOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h1', 'h2', 'img']),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ['src', 'alt', 'width', 'height'],
    a: ['href', 'target', 'rel']
  },
  allowedSchemes: ['http', 'https', 'mailto']
};

function sanitize(dirty) {
  if (typeof dirty !== 'string') return dirty;
  return sanitizeHtml(dirty, defaultOptions);
}

function sanitizeBody(...fields) {
  return (req, res, next) => {
    for (const field of fields) {
      if (req.body[field] && typeof req.body[field] === 'string') {
        req.body[field] = sanitize(req.body[field]);
      }
    }
    next();
  };
}

module.exports = { sanitize, sanitizeBody };
