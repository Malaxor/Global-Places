module.exports = app => {
   // Index
   app.get('/', (req, res) => {
      res.render("places/index");
   });
}