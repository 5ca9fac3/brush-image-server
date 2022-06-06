const { Lifetime, createContainer, asValue, asClass } = require('awilix');

const { mongoDb } = require('./mongoDb');
const { uploadImage } = require('./multer');
const { redis } = require('./redis');
const { QueueBackgroundJob } = require('./bull');
const { s3Object } = require('./s3');

const Container = () => {
  const container = createContainer();

  container.register('mongoDb', asValue(mongoDb));
  container.register('uploadImage', asValue(uploadImage));
  container.register('queueBackgroundJob', asValue(QueueBackgroundJob));
  container.register('cache', asValue(redis));
  container.register('s3Object', asValue(s3Object));

  const options = {
    cwd: __dirname,
    formatName: (_, descriptor) => {
      const path = descriptor.path.split('/');
      const className = path[path.length - 2];
      let classType = path[path.length - 3];
      classType = classType.charAt(0).toUpperCase() + classType.substring(1);
      return className + classType;
    },
    resolverOptions: {
      register: asClass,
      lifetime: Lifetime.SINGLETON,
    },
  };

  container.loadModules(['../repository/*/index.js', '../service/*/index.js'], options);

  return container;
};

module.exports = { container: Container() };
