(function() {
  'use strict';

  angular
    .module('geckoboard')
    .service('cryptoService', CryptoService);

  CryptoService.$inject = ['$http'];
  function CryptoService($http) {

  	return {
  		getHistory: getHistory
  	}

  	function getHistory(currency) {
  		return $http.get('http://www.coincap.io/history/1day/' + currency);
  	}
  } 

})();