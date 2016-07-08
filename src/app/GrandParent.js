tb.namespace( 'app', true ).GrandParent = (function(){

    // Constructor
    function GrandParent(){
        var that = this;

        that.handlers = {
            init,
            test
        };

    }

    // Prototype
    GrandParent.prototype = {

        namespace: 'app.GrandParent',

        'tb.require': [
            '/app/GrandParent.css'
        ]

    };

    return GrandParent;

    // Private Methods
    function init( e ){
        var that = this;

        for ( var x=0; x < 5; x++ ) {
            new tb(
                'app.Parent',
                {},
                that.target.appendChild( document.createElement("div") )
            );
        }
    }

    function test( e ){
        var that = this;

        console.info( 'Handler "test" in: ', that.target, 'sender: ', e );
    }

})();