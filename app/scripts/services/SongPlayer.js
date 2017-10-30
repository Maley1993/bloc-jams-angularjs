(function() {
  function SongPlayer($rootScope, Fixtures) {
    var SongPlayer = {};

    /**
    * @desc stores current album information
    * @type {Object}
    */
    var currentAlbum = Fixtures.getAlbum();

    /**
    * @desc buzz object audio file
    * @type {Object}
    */
    var currentBuzzObject = null;

    /**
    * @function stopSong
    * @desc stops playing currentBuzzObject and sets value of playing to null
    * @param {Object} song
    */

    var stopSong = function(song) {
      currentBuzzObject.stop();
      song.playing = null;
    };

    /**
    * @function playSong
    * @desc plays currentBuzzObject and sets value of playing to true
    * @param {Object} song
    */
    var playSong = function(song) {
      currentBuzzObject.play();
      song.playing = true;
    };


    /**
    * @function setSong
    * @desc stops currently playing song and loads new audio file as currentBuzzObject
    * @param {Object} song
    */
    var setSong = function(song) {
      if (currentBuzzObject) {
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
      }

      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });

      currentBuzzObject.bind('timeupdate', function() {
         $rootScope.$apply(function() {
             SongPlayer.currentTime = currentBuzzObject.getTime();
         });
      });

      SongPlayer.currentSong = song;
    };

    /**
    * @function getSongIndex
    * @desc retreives the index of the current song that is playing
    * @param {Object} song
    */
    var getSongIndex = function(song) {
      return currentAlbum.songs.indexOf(song);
    };

    /**
    * @desc object that holds current song
    * @type {Object}
    */
    SongPlayer.currentSong = null;

    /**
    * @desc Current playback time (in seconds) of currently playing song
    * @type {Number}
    */
    SongPlayer.currentTime = null;

    /**
    * @function play
    * @desc adds play function as property to the SongPlayer object.
            play function sets the current song file based on the row that is
            clicked in the album screen, plays the buzz sounds file for the row,
            and sets the value of 'playing' to true.
    * @param {Object} song
    */
    SongPlayer.play = function(song) {
      song = song || SongPlayer.currentSong;
      if (SongPlayer.currentSong !== song) {
        setSong(song);
        playSong(song);
      } else if (SongPlayer.currentSong === song) {
         if (currentBuzzObject.isPaused()) {
             playSong(song);
         }
       }
       console.log(Object.getOwnPropertyNames(SongPlayer).sort());
    };


    /**
    * @function pause
    * @desc adds pause function as property to the SongPlayer object. pause
            function pauses the buzz sound file and sets value of 'playing' to
            false.
    * @param {Object} song
    */
    SongPlayer.pause = function(song) {
      song = song || SongPlayer.currentSong;
      currentBuzzObject.pause();
      song.playing = false;
    };

    /**
    * @function previous
    * @desc stops play of current song and plays previous song
    */
    SongPlayer.previous = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      var song = currentAlbum.songs[currentSongIndex];

      currentSongIndex--;

      if (currentSongIndex < 0) {
        stopSong(song);
        // currentBuzzObject.stop();
        // SongPlayer.currentSong.playing = null;
     } else {
        //  var song = currentAlbum.songs[currentSongIndex];
         setSong(song);
         playSong(song);
     }
    };

    /**
    * @function next
    * @desc
    */
    SongPlayer.next = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      var song = currentAlbum.songs[currentSongIndex];
      currentSongIndex++;

      if (currentSongIndex === currentAlbum.songs.length ) {
        stopSong(song);
        // currentBuzzObject.stop();
        // SongPlayer.currentSong.playing = null;
     } else {
        //  var song = currentAlbum.songs[currentSongIndex];
         setSong(song);
         playSong(song);
     }
    };

    /**
    * @function setCurrentTime
    * @desc Set current time (in seconds) of currently playing song
    * @param {Number} time
    */
    SongPlayer.setCurrentTime = function(time) {
      if (currentBuzzObject) {
        currentBuzzObject.setTime(time);
      }
    };

    return SongPlayer;
  }

    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope','Fixtures',SongPlayer]);
})();
