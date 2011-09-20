Set = require("../index.js");

exports.test_sucess = function(test, assert){
  var set = new Set(function(error, hash){
    assert.equal(hash.up, "UPPER");
    test.finish();
  });
  
  set.add("up", function(arg, cb){cb(null, arg.toUpperCase());}, "upper");

};

exports.test_failure = function(test, assert){
  var set = new Set(function(error, hash){
    assert.ok(error);
    test.finish();
  });
  
  set.add("up", function(arg, cb){cb("error");}, "upper");
};


exports.test_async_success = function(test, assert){
  var set = new Set(function(error, hash){
    assert.ok(hash.async);
    assert.ok(!error);
    test.finish();
  });
  
  set.add("async", function(a, b, c, cb){
    process.nextTick(function(){
      cb(null, true);
    });
  }, 1, 2, 0);
};

exports.test_async_errors = function(test, assert){
  var i = 0;
  
  var set = new Set(function(error, hash){
    if(error){
      assert.equal(error.property, "asyncFail");
      i++;
      if(i===3){
        test.finish();
      }      
    }
  });
  
  function asyncFail(msg, cb){
    process.nextTick(function(){
      cb(msg);
    });
  }
  
  set.add("asyncFail", asyncFail, "crap");
  set.add("asyncFail", asyncFail, "crap2");
  set.add("asyncFail", asyncFail, "crap3");
 
};


exports.test_async_multi = function(test, assert){
  var i = 0;
  
  var set = new Set(function(error, hash){
    assert.ok(!error);
    assert.deepEqual(hash, {2:4, 3:8, 4:16});
    test.finish();
  });
  
  function asyncYay(value, cb){
    process.nextTick(function(){
      cb(null, value);
    });
  }
  
  set.add(2, asyncYay, 4);
  set.add(3, asyncYay, 8);
  set.add(4, asyncYay, 16);
 
};