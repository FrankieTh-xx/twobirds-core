describe("tb.utils.js", function() {

    describe("twobirds utility functions", function() {

        describe("tb.observable()", function() {

            it("tb.observable() present and typeof 'function'", function() {
                expect( typeof tb.observable === 'function' ).toBe(true);
            });

            describe("observed data simple data", function() {

                var o = tb.observable( '' );

                beforeEach(function () {
                    o( '' );
                });

                it("observed object get value", function() {
                    expect( o() === '' ).toBe(true);
                });

                it("observed object set numeric value", function() {
                    o(2);
                    expect( o() === 2 ).toBe(true);
                });

                it("observed object set string value", function() {
                    o('string');
                    expect( o() === 'string' ).toBe(true);
                });

                it("observed object set object value", function() {
                    o({});
                    expect( o() instanceof Object ).toBe(true);
                });

                it("observed object set array value", function() {
                    o([]);
                    expect( o() instanceof Array ).toBe(true);
                });

            });

            describe("observed data is object", function() {

                var o = tb.observable( {} );

                beforeEach(function () {
                    o( { a: 42 } );
                });

                it("observed object get complete object", function() {
                    expect( o().a === 42 ).toBe(true);
                });

                it("observed object replace complete object", function() {
                    o({ b: 24 });
                    expect( o('b') === 24 ).toBe(true);
                    expect( typeof o('a') === 'undefined' ).toBe(true);
                });

                it("observed object get value by key", function() {
                    expect( o('a') === 42 ).toBe(true);
                });

                it("observed object set value by key", function() {
                    o( 'a', 24 );
                    expect( o('a') === 24 ).toBe(true);
                });

                it("observed object set a namespace", function() {
                    o( 'd.e', 12 );
                    expect( o().d.e === 12 ).toBe(true);
                });

                it("observed object get a namespace", function() {
                    o( 'd.e', 6 );
                    expect( o('d.e') === 6 ).toBe(true);
                });

            });

        });

        describe("tb.namespace()", function() {

            it("present and typeof 'function'", function() {
                expect( typeof tb.namespace === 'function' ).toBe(true);
            });

            describe("variants", function() {

                var o = {};

                beforeEach(function () {
                    o = { a: 42, b:{ c: 99 } };
                });

                it("namespace object get simple property", function() {
                    expect( tb.namespace('a', o).get() === 42 ).toBe(true);
                });

                it("namespace object set simple property", function() {
                    tb.namespace('b', o).set({ c: 24 });
                    expect( tb.namespace('b.c', o).get() === 24 ).toBe(true);
                });

                it("namespace object get a namespace", function() {
                    expect( tb.namespace( 'b.c', o ).get() === 99 ).toBe(true);
                });

                it("namespace object set a namespace", function() {
                    tb.namespace( 'd.e', o ).set( 12 );
                    expect( tb.namespace('d.e', o ).get() === 12 ).toBe(true);
                });

            });

        });

        describe("tb.bind()", function() {

            it("tb.bind() present and typeof 'function'", function() {
                expect( typeof tb.bind === 'function' ).toBe(true);
            });

        });

        describe("tb.status {}", function() {

            it("tb.status {} present and typeof 'object'", function() {
                expect( typeof tb.status === 'object' ).toBe(true);
            });

        });

        describe("tb.idle()", function() {

            it("tb.idle() present and typeof 'function'", function() {
                expect( typeof tb.idle === 'function' ).toBe(true);
            });

        });

        describe("tb.getId()", function() {

            it("tb.getId() present and typeof 'function'", function() {
                expect( typeof tb.getId === 'function' ).toBe(true);
            });

        });

        describe("tb.extend()", function() {

            it("tb.extend() present and typeof 'function'", function() {
                expect( typeof tb.extend === 'function' ).toBe(true);
            });

        });

        describe("tb.parse()", function() {

            it("tb.extend() present and typeof 'function'", function() {
                expect( typeof tb.extend === 'function' ).toBe(true);
            });

        });

        describe("tb.request()", function() {

            it("tb.request() present and typeof 'function'", function() {
                expect( typeof tb.request === 'function' ).toBe(true);
            });

        });

    });

});

