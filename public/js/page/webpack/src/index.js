require.ensure('../../../../lib/jquery/dist/jquery', function (require) {
    var $ = require('../../../../lib/jquery/dist/jquery');

    console.log($.fn.jquery);
    console.log('this is webpack index.js');

})
