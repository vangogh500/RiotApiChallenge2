app.directive('ngBackgroundUrl', function(){
    return function(scope, element, attrs){
        var url = attrs.ngBackgroundUrl;
        element.css({
            'background-image': 'url(' + url +')',
            'background-size' : 'cover'
        });
    };
});