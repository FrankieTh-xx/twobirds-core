test.Greatgrandchild = class extends Tb{

    constructor(){
        super();

        var that = this;

        that.handlers = {
            init: that.init
        };

    }

    // omitted if autonomous custom element 
    static get namespace(){
        return 'test.Greatgrandchild';
    }

    // methods
    init(){

        var that = this;

        that.updateStyle();

        //that.trigger( 'test', that, 'u' );
    }

    updateStyle(){

        var that = this;

        function random(min,max) {
            var random = Math.floor(Math.random()*(max-min+1)+min);
            return random;
        }

        function randomBorderColor(){
            return 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) + ')';
        }

        $(that.target).attr('style', 'border-color:'+randomBorderColor() );

    }

};
