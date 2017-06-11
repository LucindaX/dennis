module.exports = class NotFoundError extends require('./app-error') {
  constructor(message){
    super(message || 'Not found', 404);
  }
};
