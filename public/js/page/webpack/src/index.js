require.ensure('../../../../lib/jquery/jquery', function (require) {
    require('../../../../lib/jquery/jquery');

    console.log($.fn.jquery);
    console.log('this is webpack index.js');

})
