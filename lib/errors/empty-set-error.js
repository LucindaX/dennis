module.exports = class EmptySetError extends require('./app-error') {
  constructor(message){
    super(message || 'Empty Set', 200);
  }
};
