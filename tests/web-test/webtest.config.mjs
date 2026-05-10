// Default config for tests/web-test. CLI URL still overrides defaultContext URL.
// Two contexts pointing at the same webtest publication — represent two independent
// 1C sessions (different cookies), used by multi-context tests to simulate two users.
export default {
  contexts: {
    a: { url: 'http://localhost:8081/webtest/ru_RU' },
    b: { url: 'http://localhost:8081/webtest/ru_RU' },
  },
  defaultContext: 'a',
  timeout: 60000,
};
