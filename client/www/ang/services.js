angular.module('app.services', [])

.factory('Game', ['$q', '$http', 'store', function($q, $http, store){

  var obj = {
    submitting: false,

    response: '',

    topic: '',

    myTopic: '',

    game: {

      id: undefined,

      //Array of objects, with id, name, guessed, and score
      players: [],

      //Object containing all pertinent info for the round
      current_round: {

        reader_id: undefined,

        //All answers in, ready to start guessing
        ready: false,

        //Array of objects, with id, text, guessed, and user_id
        responses: [

        ]
      },

      //Array of rounds from the server
      rounds: []
    },

    // The guess a user is going to make
    guess: {
      user: undefined,
      response: undefined
    },

    checkGame: function () {
      var remote_id = store.get('remote_id');
      if (!remote_id) {
        return $q.resolve();
      }
      return $http({
        url: Config.api + '/users/' + remote_id,
        method: 'get'
      })
      .then(function (response) {
        var newGame = false;
        var current_game_id = response.data.user.current_game_id;
        if (current_game_id !== store.get('current_game_id')) {
          newGame = true;
        }
        store.set('current_game_id', current_game_id);
        return newGame;
      })
      .catch(function (error) {
        console.log('check game error', error);
      })
    },

    getGame: function () {
      obj.game.id = store.get('current_game_id');
      if (!obj.game.id) {
        obj.resetGame();
        return $q.resolve();
      }
      return $http({
        url: Config.api + '/games/' + obj.game.id,
        method: 'get'
      })
      .then(function (response) {
        var results = response.data.results;
        obj.game.players = results.players;
        obj.rounds = results.rounds;
      })
      .catch(function (error) {
        console.log(error);
        return error;
      })
    },

    resetGame: function () {
      obj.game.players = [];
      obj.rounds = [];
      obj.game.topic = '';
      obj.game.myTopic = '';
      obj.response = '';
      obj.current_round = {
        reader_id: undefined,
        ready: false,
        response: []
      }
      obj.guess = {
        user: undefined,
        response: undefined
      }
    }
  }

  return obj;
  
}])

.service('BlankService', [function(){

}]);

