module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: { '^.+\\.[jt]s$': 'babel-jest' },
  moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' },
};
