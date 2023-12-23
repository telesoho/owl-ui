'use strict';

import {
    apply,
    isApplicationOf,
    wrap,
    unwrap,
    hasMixin,
    Mixin,
    BareMixin,
    Cached,
    DeDupe,
    HasInstance,
    mix,
} from '../mixwith';

describe('mixwith.js', () => {
    describe('apply() and isApplicationOf()', () => {
        it('has expected default structure', async () => {
            const M = (s) => class extends s {
                it() {
                    return true;
                }
            };
            class Test extends apply(Object, M) { }
            const i = new Test();
            expect(i.it()).toEqual(true);
        });
        it('isApplication() returns true for a mixin applied by apply()', () => {
            const M = (s) => class extends s { };
            expect(isApplicationOf(apply(Object, M).prototype, M)).toEqual(true);
        });
        it('isApplication() works with wrapped mixins', () => {
            const M = (s) => class extends s { };
            const WrappedM = wrap(M, (superclass) => apply(superclass, M));
            expect(isApplicationOf(WrappedM(Object).prototype, WrappedM)).toEqual(true);
        });
        it('isApplication() works with wrapped mixins', () => {
            const M = (s) => class extends s { };
            const WrappedM = wrap(M, (superclass) => apply(superclass, M));
            expect(isApplicationOf(WrappedM(Object).prototype, WrappedM)).toEqual(true);
        });

        it('isApplication() returns false when it should', () => {
            const M = (s) => class extends s { };
            const X = (s) => class extends s { };
            expect(isApplicationOf(apply(Object, M).prototype, X)).toEqual(false);
        });
    });

    describe('hasMixin()', () => {
        it('hasMixin() returns true for a mixin applied by apply()', () => {
            const M = (s) => class extends s { };

            expect(hasMixin(apply(Object, M).prototype, M)).toEqual(true);
        });

    });

    describe('wrap() and unwrap()', () => {

        it('wrap() sets the prototype', () => {
            const f = (x) => x * x;
            f.test = true;
            const wrapper = (x) => f(x);
            wrap(f, wrapper);
            expect(wrapper.test).toEqual(true);
            expect(f).toEqual(Object.getPrototypeOf(wrapper));
        });

        it('unwrap() returns the wrapped function', () => {
            const f = (x) => x * x;
            const wrapper = (x) => f(x);
            wrap(f, wrapper);
            expect(f).toEqual(unwrap(wrapper));
        });

    });

    describe('BareMixin', () => {

        it('mixin application is on prototype chain', () => {
            const M = BareMixin((s) => class extends s { });
            class C extends M(Object) { }
            const i = new C();
            expect(hasMixin(i, M)).toEqual(true);
        });

        it('methods on mixin are present', () => {
            const M = BareMixin((s) => class extends s {
                foo() { return 'foo'; }
            });
            class C extends M(Object) { }
            const i = new C();
            expect(i.foo()).toEqual('foo');
        });

        it('methods on superclass are present', () => {
            const M = BareMixin((s) => class extends s { });
            class S {
                foo() { return 'foo'; }
            }
            class C extends M(S) { }
            const i = new C();
            expect(i.foo()).toEqual('foo');
        });

        it('methods on subclass are present', () => {
            const M = BareMixin((s) => class extends s { });
            class C extends M(Object) {
                foo() { return 'foo'; }
            }
            const i = new C();
            expect(i.foo()).toEqual('foo');
        });

        it('methods on mixin override superclass', () => {
            const M = BareMixin((s) => class extends s {
                foo() { return 'bar'; }
            });
            class S {
                foo() { return 'foo'; }
            }
            class C extends M(S) { }
            const i = new C();
            expect(i.foo()).toEqual('bar');
        });

        it('methods on mixin can call super', () => {
            const M = BareMixin((s) => class extends s {
                foo() { return super.foo(); }
            });
            class S {
                foo() { return 'superfoo'; }
            }
            class C extends M(S) { }
            const i = new C();
            expect(i.foo()).toEqual('superfoo');
        });

        it('methods on subclass override superclass', () => {
            const M = BareMixin((s) => class extends s { });
            class S {
                foo() { return 'superfoo'; }
            }
            class C extends M(S) {
                foo() { return 'subfoo'; }
            }
            const i = new C();
            expect(i.foo()).toEqual('subfoo');
        });

        it('methods on subclass override mixin', () => {
            const M = BareMixin((s) => class extends s {
                foo() { return 'mixinfoo'; }
            });
            class S { }
            class C extends M(S) {
                foo() { return 'subfoo'; }
            }
            const i = new C();
            expect(i.foo()).toEqual('subfoo');
        });

        it('methods on subclass can call super to superclass', () => {
            const M = BareMixin((s) => class extends s { });
            class S {
                foo() { return 'superfoo'; }
            }
            class C extends M(S) {
                foo() { return super.foo(); }
            }
            const i = new C();
            expect(i.foo()).toEqual('superfoo');
        });

    });

    describe('DeDupe', () => {

        it('applies the mixin the first time', () => {
            const M = DeDupe(BareMixin((superclass) => class extends superclass { }));
            class C extends M(Object) { }
            const i = new C();
            expect(hasMixin(i, M)).toEqual(true);
        });

        it('does\'n apply the mixin the second time', () => {
            let applicationCount = 0;
            const M = DeDupe(BareMixin((superclass) => {
                applicationCount++;
                return class extends superclass { };
            }));
            class C extends M(M(Object)) { }
            const i = new C();
            expect(hasMixin(i, M)).toBe(true);
            expect(applicationCount).toEqual(1);
        });

    });

    describe('Mixin function', () => {
        it('Use Defining Mixin', () => {
            let MyMixin = Mixin((superclass) => class extends superclass {

                constructor(...args) {
                    // mixins should either 1) not define a constructor, 2) require a specific
                    // constructor signature, or 3) pass along all arguments.
                    super(...args);
                };

                foo() {
                    console.log('foo from MyMixin');
                    // this will call superclass.foo()
                    // super.foo();
                };

            });

            class MyClass extends mix().with(MyMixin) {
                constructor(a, b) {
                    super(a, b); // calls MyMixin(a, b)
                };

                foo() {
                    console.log('foo from MyClass');
                    super.foo(); // calls MyMixin.foo()
                }
            };

            const c = new MyClass(1, 2);
            c.foo();
        })

    });

    describe('HasInstance', () => {

        let hasNativeHasInstance = false;
        beforeEach(() => {
            // Enable the @@hasInstance patch in mixwith.HasInstance
            if (!Symbol.hasInstance) {
                Symbol.hasInstance = Symbol('hasInstance');
            }

            class Check {
                static [Symbol.hasInstance](o) { return true; }
            }
            hasNativeHasInstance = 1 instanceof Check;
        });

        it('subclasses implement mixins', () => {
            const M = HasInstance((s) => class extends s { });
            class C extends M(Object) { }
            const i = new C();

            if (hasNativeHasInstance) {
                expect(i).toBeInstanceOf(C);
            } else {
                expect(C[Symbol.hasInstance](i)).toBe(true);
            }
        });

    });

    describe('mix().with()', () => {

        it('applies mixins in order', () => {
            const M1 = BareMixin((s) => class extends s { });
            const M2 = BareMixin((s) => class extends s { });
            class S { }
            class C extends mix(S).with(M1, M2) { }
            const i = new C();
            expect(hasMixin(i, M1)).toBe(true);
            expect(hasMixin(i, M2)).toBe(true);
            expect(isApplicationOf(i.__proto__.__proto__, M2)).toBe(true);
            expect(isApplicationOf(i.__proto__.__proto__.__proto__, M1)).toBe(true);
            expect(i.__proto__.__proto__.__proto__.__proto__).toEqual(S.prototype);
        });

        it('mix() can omit the superclass', () => {
            const M = BareMixin((s) => class extends s {
                static staticMixinMethod() {
                    return 42;
                }

                foo() {
                    return 'foo';
                }
            });
            class C extends mix().with(M) {
                static staticClassMethod() {
                    return 7;
                }

                bar() {
                    return 'bar';
                }
            }
            let i = new C();
            expect(hasMixin(i, M)).toBe(true);
            expect(isApplicationOf(i.__proto__.__proto__, M)).toBe(true);
            expect('foo').toEqual(i.foo());
            expect('bar').toEqual(i.bar());
            expect(42).toEqual(C.staticMixinMethod());
            expect(7).toEqual(C.staticClassMethod());
        })
    });

})

