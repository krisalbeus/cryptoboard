(function() {
  'use strict';

  angular
    .module('geckoboard')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(cryptoService, fxService, $filter) {
    var vm = this;
    var audExchangeRate = 0;

    fxService.getRate('USD', 'AUD').then(function(rate) {
      audExchangeRate = rate;
    });

    vm.currencies = {
      BTC: {
        quantity: 1.95639,
        name: 'Bitcoin'
      },
      ETH: {
        quantity: 92.25704,
        name: 'Ethereum'
      },
      XRP: {
        quantity: 52094.54242,
        name: 'Ripple'
      },
      LTC: {
        quantity: 192.30769,
        name: 'Litecoin'
      },
      DASH: {
        quantity: 97.83954,
        name: 'Dash'
      },
      ETC: {
        quantity: 1769.83335,
        name: 'EthereumClassic'
      }
    };

    vm.data = {};
    Object.keys(vm.currencies).forEach(function(currency) {
      vm.data[currency] = {};

      cryptoService.getHistory(currency)
        .then(function(response) {
          var prices = response.data.price.map(function(price) {
            return {
              timestamp: price[0],
              price: price[1]
            };
          });
          var sorted = $filter('orderBy')(prices, 'timestamp', true);
          var todaysPrice = sorted[0];
          var yesterdaysPrice = sorted[sorted.length - 1];

          vm.data[currency] = todaysPrice;
          vm.data[currency].currency = currency;
          vm.data[currency].increased = todaysPrice.price > yesterdaysPrice.price;
          vm.data[currency].rate = todaysPrice.price > yesterdaysPrice.price ?
            (todaysPrice.price / yesterdaysPrice.price - 1) * 100 :
            (yesterdaysPrice.price / todaysPrice.price - 1) * 100;
          vm.data[currency].value = todaysPrice.price * vm.currencies[currency].quantity;
          vm.data[currency].info = vm.currencies[currency];
        });

    });

    vm.sum = function() {
      var total = 0;
      angular.forEach(vm.data, function(data) {
        total += data.value;
      });
      return audExchangeRate * total;
    };

  }
})();
