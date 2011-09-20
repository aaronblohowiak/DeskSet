
DeskSet = function(cb){
  this.result = {};
  this.pendingResults = 0;
  this.cb = cb;
  var self = this;
};

var slice =  Array.prototype.slice;

DeskSet.prototype = {
  result: {},
  add: function(property, fn, argumentArray){
    this.pendingResults = this.pendingResults + 1;
    var self = this;
    if(!Array.isArray(argumentArray)){
      argumentArray = slice.call(arguments).slice(2);
    }
    argumentArray.push( function(err, result){
      if(err){
        var error = {};
        error.property = property;
        error.error = err;
        self.cb(error);
      }
      self.result[property] = result; // assign the rest to the object.
      self.fnComplete();
    });
    
    fn.apply(this, argumentArray);
  },
  fnComplete: function(){
    this.pendingResults = this.pendingResults - 1;
    if(this.pendingResults === 0) {
      this.cb(null, this.result);
    }
  }
};

module.exports = DeskSet;