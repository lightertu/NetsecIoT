var User = require('../models/user');
module.exports = function(router) {
    router.post('/users', function(req, res){
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.email;
        user.email = req.body.email;
        console.log(req.body);
        if ( req.body.username == null || req.body.username == '' || 
             req.body.password == null || req.body.password == '' || 
             req.body.email == null || req.body.email == '' ) {
             res.send("Ensure Username, email and password were provided");
             // res.send(req.body.username + req.body.password + req.body.email);
        } else {
            user.save(function(err){
                if (err) {
                    res.send(err);
                } else {
                    res.send("User created");
                }
            });
        }
    });

    router.get("home");
    return router
}
