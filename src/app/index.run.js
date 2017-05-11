(function() {
  'use strict';

  angular
    .module('geckoboard')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
