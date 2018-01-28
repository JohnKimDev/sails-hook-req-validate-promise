var should  = require('should');

describe('09 OrController Test', function(){

  it('should be status 200 ok when valid email is passed', function(done){
    sails.request({
      url: '/or-error',
      method: 'post'
    }, {usernameOrEmail: 'joseba@seba.com'}, function(err, res, body){
      if(err) return done(err);
      res.statusCode.should.be.equal(200);
      body.usernameOrEmail.should.be.equal('joseba@seba.com');
      return done();
    });
  });

  it('should be status 200 ok, when a username as string is passed', function(done){
    sails.request({
      url: '/or-error',
      method: 'post'
    }, {usernameOrEmail: 'joseba'}, function(err, res, body){
      if(err) return done(err);
      res.statusCode.should.be.equal(200);
      body.usernameOrEmail.should.be.equal('joseba');
      return done();
    });
  });

  it('should be status 200 ok, when null is passed for an optional key', function(done){
    sails.request({
      url: '/or-error-optional',
      method: 'post'
    }, null, function(err, res, body){
      if(err) return done(err);
      res.statusCode.should.be.equal(200);
      return done();
    });
  });

  it('should be status 200 ok, when a valid email is passed for an optional key', function(done){
    sails.request({
      url: '/or-error-optional',
      method: 'post'
    }, {usernameOrEmail: 'joseba@seba.com'}, function(err, res, body){
      if(err) return done(err);
      res.statusCode.should.be.equal(200);
      body.usernameOrEmail.should.be.equal('joseba@seba.com');
      return done();
    });
  });

  it('should be 200 code, when a valid email is passed to conversion field', function(done){
    sails.request({
      url: '/or-error-conversion',
      method: 'post'
    }, {usernameOrEmail: 'abcdef@exampe.com'}, function(err, res, body){
      if(err) return done(err);
      res.statusCode.should.be.equal(200);
      body.usernameOrEmail.should.be.equal('ABCDEF@EXAMPE.COM');
      return done();
    });
  });

  it('should be 400 code, invalid usernameOrEmail type', function(done){
    sails.request({
      url: '/or-error',
      method: 'post'
    }, null, function(err, res, body){
      err.should.be.instanceOf(Object);
      err.status.should.be.equal(400);
      err.body.should.be.instanceOf(String);
      err.body.should.be.equal('usernameOrEmail is required.');
      return done();
    });
  });

  it('should be 400 code, invalid usernameOrEmail type', function(done){
    sails.request({
      url: '/or-number-email',
      method: 'post'
    }, {numberOrEmail: "abcdef"}, function(err, res, body){
      err.should.be.instanceOf(Object);
      err.status.should.be.equal(400);
      err.body.should.be.instanceOf(String);
      err.body.should.be.equal('numberOrEmail: abcdef has to be numeric or email type.');
      return done();
    });
  });

});
