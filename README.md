[![build status](https://secure.travis-ci.org/aaronblohowiak/DeskSet.png)](http://travis-ci.org/aaronblohowiak/DeskSet)
# DeskSet - Yet Another Asynchronous JS Library

![Desk Set](http://ia.media-imdb.com/images/M/MV5BMTkxNTE4NzgyNV5BMl5BanBnXkFtZTcwMzA0MzUyMQ@@._V1._SY317_CR4,0,214,317_.jpg)

## WHY?!?!?!?

I wanted something simple enough even I could use it =)

## WHAAAAAT!?!?

Run some functions in parallel, storing their result in the properties of a single result object.  When there is an error or everything is done running in parallel, invoke my callback.


## Short Example

    var DS = require("DeskSet");

    var set = new DS(cb);

    set.add(propertyName, asyncfn, [arg1, arg2... argN]);
    set.add(propertyName2, asyncfn2, [arg1, arg2... argM]);


## Example

    var Set = require("DeskSet");

    //Define some Async functions.
    
    function getUser(id, cb){
      process.nextTick(function(){ //use redis or mongo or couch..
        cb(null, {name:"Aaron"});
      })
    };
    
    function getSomeData(filename, cb){
      fs.readFile("./"+filename, cb); //security hole!!
    }
    
    function render(name, data){
      console.log(sys.inspect(data));
    }
    
    routes.get("/home", function(req, res){
      var set = new Set(function(err, result){
        if(err){
          process.exit(); //oops!
        }
        res.end(render("home", result));
      });
      
      set.add("user", getUser, req.params.id);
      set.add("someData", getSomeData, "myfilename");
      set.add("someOtherData", getSomeData, "myOtherFilename");
    });


    // This will result in
    
    {
      user: {
        name: "Aaron"
      },
      someData: "contents of myfilename",
      someOtherData: "contents of myOtherFilename"
    }
    
Anyway, I have found that this is the easiest way for my feeble brain to do parallel tasks.


# API for parallel execution in Node.js

    var DS = require("DeskSet");
    
    var set = new DS(cb);
    
    set.add(propertyName, fn, [arg1, arg2... argN]);
    set.add(propertyName2, fn2, [arg1, arg2... argM]);


## `var set = new DeskSet(cb)`

Create a new DeskSet object by passing in a callback, that is a function that accepts `err, result` as its arguments.

### Your callback
Your callback will be invoked once for each error and once when all functions have returned.

#### On error

The error passed to your callback is in the form of `{property: propertyName, error: err}`.

`property` is populated with the propertyName you passed to `add` when adding the function to the DeskSet.

`error` is the error that the function passed.

#### On completion

Your callback will be called when all of the other functions have completed, regardless of any errors.

`err` will be `null`.

`result` is a plain javascript object where each property is assigned the result of its corresponding functions.

## `set.add(propertyName, fn, [arg1, arg2... argN])`

`fn` is a function in the form of `function([arg1, arg2... argN], cb)` where the cb is expected to be of the type: `function(err, result){}` 

`propertyName` is the key that the result of this function invocation will be stored in.


# Do you support ... ?

Probably not.  DeskSet is super simple.  There is no timeout, automatic try/catch wrapping, or cake.
