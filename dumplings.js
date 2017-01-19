"use strict";

/** ---------------------------------- *
 * Dumplings
 * ----------------------------------- */

(function($, _) {

  // Config
  var _dumplings = [];
  var _numDumplingsWaiting = 500;
  var _numDumplingsActive = 0;
  var _dumplingSize = 128;
  var _dumplingSpeed = 5;
  var _dumplingSpawnRate = 500;
  var _frameRate = 33;
  var _$dumplings = $('#dumplings');
  var _$count = $('#count');


  // Get random x coordinate in window
  var _randomX = function() {
    return (Math.random() * ($(document).width() - _dumplingSize)) + 'px';
  };


  // Apply click listener
  _$dumplings.on('click', '.dumpling', function(e) {
    var $dumpling = $(e.target);
    $dumpling.remove();
    _numDumplingsWaiting++;
    _numDumplingsActive--;
    _$count.text(_numDumplingsActive);
  });


  // Set animation interval
  setInterval(function() {
    _.each(_dumplings, function($dumpling) {
      $dumpling.css('top', '+=' + _dumplingSpeed + 'px');

      var y = parseInt($dumpling.css('top').replace('px', ''));
      if (y > $(window).height()) {
        $dumpling.css({
          top: '-' +_dumplingSize + 'px',
          left: _randomX()
        });
      }
    });
  }, _frameRate);


  // Spawn dumpling interval
  setInterval(function() {
    if (_numDumplingsWaiting > 0) {
      var $dumpling = $('<img>')
        .addClass('dumpling')
        .attr('src', '/dumpling.png')
        .css({
          position: 'absolute',
          top: '-' +_dumplingSize + 'px',
          left: _randomX()
        });
      _dumplings.push($dumpling);
      _$dumplings.append($dumpling);
      _numDumplingsWaiting--;
      _numDumplingsActive++;
      _$count.text(_numDumplingsActive);
    }
  }, _dumplingSpawnRate);

})($, _);





