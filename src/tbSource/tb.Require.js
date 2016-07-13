/**
 @class tb.Require
 @constructor

 @param   {array} pRequiredFiles - array containing required files

 @return {void}

 tb.require class

 - add into prototype of your constructor
 - instance will get an 'init' event when all files have loaded.

 @example

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

            'tb.Require': [
                '/app/GrandParent.css'
            ]

        };

        return GrandParent;

        // Private Methods

        // ...

    })();

 */
if ( typeof module === 'undefined' ) {

    tb.Require = function (pConfig, pCallback ) {

        var that = this;

        if (!pConfig) return;

        that.requirements = pConfig;

        // add requirement loading
        tb.loader.load(
            that.requirements,
            function () {
                if ( !!that['target'] && !!that['target']['tb.Require'] ){
                    that.target.trigger('init');
                }
                if ( typeof pCallback === 'function'){
                    pCallback();
                }
            }
        );

    };

    tb.Require.prototype = {
        ready: function () {
            // do we need this???
        }
    };

    /**
     * requirement handling
     */
    (function () {
        // private

        function getTypeFromSrc(pSrc) {
            return pSrc.split('?')[0].split('.').pop();
        }

        // requirement constructor
        function _Requirement(pConfig) {

            var that = this,
                type = getTypeFromSrc(pConfig.src), // filename extension
                typeConfigs = { // standard configuration types
                    'css': {
                        tag: 'link',
                        attributes: {
                            type: 'text/css',
                            rel: 'stylesheet',
                            href: '{src}'
                        }
                    },
                    'js': {
                        tag: 'script',
                        attributes: {
                            type: 'text/javascript',
                            src: '{src}'
                        }
                    }
                },
                typeConfig, // a single type configuration
                element,
                isTyped = !!typeConfigs[type];

            // if already loaded
            if (!!tb.loader.requirementGroups[type][pConfig.src.split('?')[0]]
                && !!tb.loader.requirementGroups[type][pConfig.src.split('?')[0]].done) { // already loaded

                that.trigger('requirementLoaded', src.split('?')[0], 'u');

                return;
            }
            
            tb.status.loadCount(tb.status.loadCount() + 1); // increase loadCount

            pConfig.type = type; // add type

            that.config = pConfig;

            // cache busting
            if (!!that.config.src) {
                that.config.src = that.config.src + ( that.config.src.indexOf('?') > -1 ? '&' : '?' ) + tb.getId();
            }

            //that.target = pConfig.target;
            that.src = pConfig.src;
            that.type = that.config.type = type;
            that.done = false;
            that.cb = that.config.cb || function () {
                };
            that.data = tb.observable({});

            // element 'load' callback
            function onLoad(e) {

                if (!!e && e.data) {
                    that.data(e.data);
                }

                that.done = true;

                if (that.type === 'js') {
                    setTimeout(
                        function () {
                            tb.status.loadCount(tb.status.loadCount() - 1); // decrease loadCount
                        },
                        50
                    );
                } else {
                    tb.status.loadCount(tb.status.loadCount() - 1); // decrease loadCount
                }

                that.trigger('requirementLoaded', that.src, 'u');

            }

            // execute onLoad only once
            onLoad.once = true;

            // handlers
            that.handlers = {
                'onLoad': onLoad
            };


            if (isTyped) { // either *.css or *.js file

                // get default config for type
                typeConfig = typeConfigs[type];

                // create DOM element
                element = document.createElement(typeConfig.tag);
                element.async = true;
                element.onreadystatechange = element.onload = function () {
                    var state = element.readyState;
                    if (!that.done && (!state || /loaded|complete/.test(state))) {
                        that.trigger('onLoad', element);
                    }
                };

                // add attributes to DOM element
                for (var i in typeConfig.attributes) if (typeConfig.attributes.hasOwnProperty(i)) {
                    element.setAttribute(i, tb.parse(typeConfig.attributes[i], that.config));
                }

                // append node to head
                document.getElementsByTagName('head')[0].appendChild(element);

                that.element = element;

            } else { // load via request if unknown type, trigger callback with text or JSON

                var f = function (data) {

                    if (that.type === 'json' && !!data['text']) {
                        try {
                            data = JSON.parse(data.text);
                        } catch (e) {
                            console.log('error parsing, JSON expected in:', data);
                        }
                    } else {
                        data = data.text;
                    }

                    that.trigger('onLoad', data);
                };

                var options = {
                    url: that.src,
                    success: f,
                    error: f
                };

                tb.request(options);

            }

        }

        _Requirement.prototype = {
            namespace: '_Requirement'
        };


        // requirement group constructor
        function _RequirementGroup(pConfig) {

            var that = this;

            that.type = pConfig.type;
            that.target = pConfig.target;

            that.requirements = {};

        };

        _RequirementGroup.prototype = {

            namespace: '_RequirementGroup',

            load: function (pSrc) {

                var that = this,
                    rq = !!that.requirements[pSrc];

                if (!rq) { // not loading or loaded: add a new requirement

                    rq = that.requirements[pSrc] = new tb(
                        _Requirement,
                        {
                            src: pSrc,
                            target: that.target
                        },
                        that.requirements
                    );

                    that.requirements[pSrc].target = tb.loader; // needed for event bubbling

                } else { // already loading or loaded

                    rq = that.requirements[pSrc];

                }

                if (!!rq.done) { // already loaded
                    rq.trigger('onLoad');

                }

            }

        };


        function Loader(pConfig) {
            var that = this;

            that.config = pConfig;
            that.requirementGroups = {}; // will later contain requirement groups ( grouped by file extension )
            that.rqSets = []; // requirement sets, may contain various file types

            that.handlers = {
                requirementLoaded: requirementLoaded
            }
        };

        Loader.prototype = {

            namespace: '_Head',

            load: function (pSrc, pCallback) {

                var that = this,
                    pCallback = pCallback || function (e) {
                            console.log('onLoad dummy handler on', e);
                        },
                    type,
                    rg,
                    pSrc = typeof pSrc === 'string' ? [pSrc] : pSrc, // convert to array if string
                    pSrc = [].concat.call( [], pSrc); // make an array copy


                // will trigger loading if necessary ( async callback even if already loaded )
                pSrc
                    .forEach(
                        function (filename) {
                            type = getTypeFromSrc(filename);
                            rg = !!that.requirementGroups[type];

                            if (!rg) { // add a new requirement group

                                that.requirementGroups[type] = new tb(
                                    _RequirementGroup,
                                    {
                                        type: type
                                    },
                                    that.requirementGroups
                                );

                                that.requirementGroups[type].target = tb.loader; // needed for event bubbling
                            }

                            rg = that.requirementGroups[type];

                            rg.load(filename);
                        }
                    );

                pSrc.callback = pCallback;

                pSrc.done = function (pFilename) { // will be called when each file 'requirementLoaded' was triggered
                    if (pSrc.indexOf(pFilename) > -1) {
                        pSrc.splice(pSrc.indexOf(pFilename), 1);
                    }
                };

                that.rqSets.push(pSrc);

            },

            get: function (pFileName) {

                var that = this,
                    type = getTypeFromSrc(pFileName),
                    rg = that.requirementGroups[type] ? that.requirementGroups[type] : false,
                    rq = rg ? ( rg.requirements[pFileName] ? rg.requirements[pFileName] : false ) : false;

                return rq ? rq.data() : 'data missing for: ' + pFileName;
            },

            idle: function() {
                var that = this;

                return !!that.rqSets; // false if everything loaded
            }

        };

        tb.loader = new tb(Loader);

        function requirementLoaded(e) {

            var that = this,
                filename = e.data.split('?')[0];

            that
                .rqSets
                .forEach(
                    function (pRqSet) {
                        pRqSet.done(filename);
                        if (pRqSet.length === 0) { // every file loaded
                            pRqSet.callback();
                        }
                    }
                );

            that.rqSets = that
                .rqSets
                .filter(
                    function (pElement) {
                        return pElement.length > 0;
                    }
                );

            e.stopPropagation();
        }

    })();

} else {
    // todo: in a node module
    console.log( 'tb.Require not implemented yet for node use!!!');
}