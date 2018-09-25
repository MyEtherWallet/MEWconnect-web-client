const path = require('path');

function appRouter(router) {
  const srcDir = path.resolve('.', './example/etherwallet/dist');
  /* GET home page. */
  router.get('/', (req, res) => {
    // set mew site as default
    res.type('text/html');
    res.status(200);
    res.sendFile(path.join(srcDir, 'index.html'));
  });
}
