module.exports = app => {
   // Index
   app.get('/', (req, res) => {
      res.send('this is the landing page');
   });
}