"use strict";

/** ---------------------------------- *
 * Dumplings
 * ----------------------------------- */

(function($, _) {

  // ----------------------------------------
  // Config
  // ----------------------------------------


  var NUM_SOUNDS = 10;
  var IMAGES_PATH = '/assets/images/';
  var AUDIO_PATH = '/assets/audio/';
  var _dumplings = [];
  var _uhOhs = [];
  var _booms = [];
  var _numDumplingsWaiting = 500;
  var _numDumplingsActive = 0;
  var _dumplingSize = 128;
  var _dumplingSpeed = 5;
  var _dumplingSpawnRate = 550;
  var _dumplingExplosionSpeed = 300;
  var _frameRate = 33;
  var _imageSources = {
    dumpling: IMAGES_PATH + 'dumpling.png',
    hurt: IMAGES_PATH + 'dumpling-hurt.png',
    boom: IMAGES_PATH + 'boom.png'
  };
  var _$dumplings = $('#dumplings');
  var _$count = $('#count');


  // ----------------------------------------
  // Functions
  // ----------------------------------------


  // Get random x coordinate in window
  var _randomX = function() {
    return (Math.random() * ($(document).width() - _dumplingSize)) + 'px';
  };


  // Create dumpling
  var _createDumpling = function() {
    return $('<img>')
      .addClass('dumpling')
      .attr('src', _imageSources.dumpling)
      .css({
        position: 'absolute',
        top: '-' +_dumplingSize + 'px',
        left: _randomX()
      });
  };


  // Play the uh oh sound
  var _playUhOh = function() {
    var uhOh = _.find(_uhOhs, function(uhOh) {
      return !uhOh.playing();
    });
    if (uhOh) {
      uhOh.play();
    }
  };


  // Play the boom sound
  var _playBoom = function() {
    var boom = _.find(_booms, function(boom) {
      return !boom.playing();
    });
    if (boom) {
      boom.play();
    }
  };


  // Animate explosion
  var _animateExplosion = function($dumpling) {
    $dumpling.animate({
      width: (_dumplingSize * 2) + 'px',
      height: (_dumplingSize * 2) + 'px'
    }, _dumplingExplosionSpeed / 2);

    $dumpling.animate({
      width: '0px',
      height: '0px'
    }, _dumplingExplosionSpeed / 2);
  };


  // Get that dumpling out of here
  var _removeDumpling = function($dumpling) {
    setTimeout(function() {
      $dumpling.remove();
    }, _dumplingExplosionSpeed);
  };


  // Buh bye!
  var _buhByeDumpling = function($dumpling) {
    setTimeout(function() {
      $dumpling.attr('src', _imageSources.boom);
      _playBoom();
      _animateExplosion($dumpling);
      _removeDumpling($dumpling);
    }, _dumplingExplosionSpeed);
  };


  // Explode! Kill the dumpling!
  var _explodeDumpling = function($dumpling) {
    $dumpling.attr('src', _imageSources.hurt);
    _playUhOh();
    _buhByeDumpling($dumpling);
  };


  // ----------------------------------------
  // Initialization
  // ----------------------------------------


  // Create uh ohs
  _.times(NUM_SOUNDS, function() {
    var uhOh = new Howl({ src: [AUDIO_PATH + 'uh-oh.wav'] });
    _uhOhs.push(uhOh);
  });


  // Create booms
  _.times(NUM_SOUNDS, function() {
    var boom = new Howl({ src: [AUDIO_PATH + 'boom.wav'] });
    _booms.push(boom);
  });


  // Apply click listener
  _$dumplings.on('click', '.dumpling', function(e) {
    var $dumpling = $(e.target);

    if ($dumpling.attr('data-clicked')) {
      return;
    }
    $dumpling.attr('data-clicked', true);

    _explodeDumpling($dumpling);

    _numDumplingsActive--;
    _numDumplingsWaiting++;
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
      var $dumpling = _createDumpling();
      _dumplings.push($dumpling);
      _$dumplings.append($dumpling);

      _numDumplingsActive++;
      _numDumplingsWaiting--;
      _$count.text(_numDumplingsActive);
    }
  }, _dumplingSpawnRate);

})($, _);





