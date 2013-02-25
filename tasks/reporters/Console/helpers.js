var BLOCK = '\u2588';

exports.fitWhitespace = function(maxLength, string) {

  var remaining = maxLength - string.length;

  // Prevent negative values from breaking the array
  remaining = Math.max(0, remaining);

  return string + Array(remaining + 3).join(' ');

};


exports.longestString = function(arrayOfStrings) {

  var clone = Array.apply(null, arrayOfStrings);

  var longestLength = clone.reduce(function(memo, a) {
    return memo > a.length ? memo : a.length;
  }, 0);

  return longestLength;

};

exports.generateBar = function(score, threshold) {

  // 17.1 for 1/10 of 171, the maximum score
  var magnitude = Math.floor(score / 17.1);
  var bar = Array(magnitude).join(BLOCK) + ' ' + score.toPrecision(5);

  // Out of 171 points, what % did it earn?
  var rating = score / threshold;

  return rating < 1 ? bar.red : rating < 1.2 ? bar.yellow : bar.green;

};