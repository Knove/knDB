/**
 *  status.js
 *
 *  there is DB I/O timing throw utils
 */

export default {
  Error: (O, c, m) => {
    c.success = false;
    c.errorInfo = m;
    return new O(c);
  },
  Success: (O, c, d) => {
    c.success = true;
    return new O(c, d);
  },
  errorInfo: m => ({
    code: 1,
    errorInfo: m,
  }),
  successInfo: () => ({
    code: 0,
  }),
};
