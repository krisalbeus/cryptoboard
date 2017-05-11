(function() {
  'use strict';

  angular
    .module('geckoboard')
    .component('cryptoComponent', {
    	templateUrl: 'app/components/cryptoComponent/cryptoComponent.html',
    	controller: CryptoComponent,
    	controllerAs: 'cryptoComponentVm',
    	bindings: {
    		data: '<',
        index: '<'
    	}
    });

  CryptoComponent.$inject = ['cryptoService', '$filter'];

  function CryptoComponent(cryptoService, $filter) {
    var cryptoComponent = this;
  }
})();
