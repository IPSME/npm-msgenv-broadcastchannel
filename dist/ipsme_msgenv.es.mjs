// https://stackoverflow.com/questions/4602141/variable-name-as-a-string-in-javascript
// console.log('OUT', __name({variableName}) );
//-------------------------------------------------------------------------------------------------
function l_array_(arr_labels, start = 1) {
    if (!Array.isArray(arr_labels))
        throw new Error('arr_labels must be an array');
    if (!Number.isSafeInteger(start) || start < 0)
        throw new Error('start must be a safe, non-negative integer');
    return Object.freeze(arr_labels.reduce((acc, key, index) => {
        acc[key] = start << index;
        return acc;
    }, {}));
}
//-------------------------------------------------------------------------------------------------
function handler_default_( /* ... */) {
    // https://stackoverflow.com/questions/18746440/passing-multiple-arguments-to-console-log
    var args = Array.prototype.slice.call(arguments);
    console.log.apply(console, args);
}
function l_toBigInt_(obj_labels, obj, ignore = false) {
    if (!obj_labels || typeof obj_labels !== 'object')
        throw new Error('obj_labels must be an object');
    if (!obj || typeof obj !== 'object')
        throw new Error('obj must be an object');
    let bigint_l = BigInt(0);
    for (const [k, v] of Object.entries(obj)) {
        if ((ignore || v) && obj_labels[k] !== undefined && typeof obj_labels[k] === 'number')
            bigint_l |= BigInt(obj_labels[k]);
        // console.log('0b'+ bigInt.toString(2) );
    }
    return bigint_l;
}
function lRef(initial) {
    if (arguments.length === 0 || initial === undefined) {
        return undefined;
    }
    let value = initial;
    return {
        get: () => value,
        set: (newVal) => { value = newVal; }
    };
}
/*
const l_ = {
    get VALIDATION() { return logr_.lref.get().VALIDATION; }
}

function createBitFlags(ref) {
    // Create a proxy so that any property access computes the current bit
    return new Proxy({}, {
        get(target, prop, receiver) {
            const positions = ref.get();           // get current { VALIDATION: n, ... }
            const position = positions[prop];      // e.g., positions['VALIDATION']

            if (position === undefined) {
                // Optional: warn or return 0 for unknown keys
                console.warn(`Unknown bitflag key: ${String(prop)}`);
                return 0;
            }

            return 0b1 << position;  // or 1 << position
        },

        // Optional: make Object.keys(l_) show the actual keys
        ownKeys(target) {
            return Object.keys(ref.get());
        },

        getOwnPropertyDescriptor(target, prop) {
            return {
                enumerable: true,
                configurable: true,
            };
        }
    });
}

type BitPositions = Record<string, number>;

function createBitFlags<T extends BitPositions>(ref: { get: () => T }) {
    return new Proxy({} as { [K in keyof T]: number }, {
        get(target, prop: string | symbol) {
            if (typeof prop !== 'string') return undefined;
            const positions = ref.get();
            const position = positions[prop as keyof T];
            if (position === undefined) return 0;
            return 1 << position;
        },
        ownKeys() {
            return Object.keys(ref.get());
        },
        getOwnPropertyDescriptor() {
            return { enumerable: true, configurable: true };
        }
    });
}
*/
function create_Referenced_l_(ref) {
    return new Proxy({}, {
        get(target, prop) {
            if (typeof prop !== 'string')
                return undefined;
            // if (prop === 'get') {
            // 	return () => {
            // 		const positions = ref.get();
            // 		const result: Partial<Record<keyof T, number>> = {};
            // 		for (const key in positions) {
            // 			result[key as keyof T] = positions[key];
            // 		}
            // 		return result as Record<keyof T, number>;
            // 	};
            // }
            if (prop === 'get')
                return () => ref.get();
            const positions = ref.get();
            const value = positions[prop];
            if (value === undefined)
                return 0;
            return value;
        },
        ownKeys() {
            return Object.keys(ref.get());
        },
        getOwnPropertyDescriptor() {
            return { enumerable: true, configurable: true };
        }
    });
}
const LOGR = (function () {
    let _instance; // Private variable to hold the single instance
    // Module-level state would work - but only when the module is loaded once. 
    // Your bundler is currently bundling @knev/bitlogr into your distribution file, 
    // creating a second copy. The Global Symbol approach would work around this, 
    // but it's treating the symptom, not the cause. 
    const GLOBAL_KEY = Symbol.for('@knev/bitlogr/LOGR');
    // The real issue is your build configuration bundling dependencies that should remain external.
    // rollup.config.mjs: external: ['@knev/bitlogr', 'uuid'], // Don't bundle these
    function _create_instance() {
        const _id = Math.random();
        if (globalThis.LOGR_ENABLED ?? true)
            console.log('creating LOGR instance:', _id);
        // Private state (replacing constructor properties)
        let _Bint_toggled = BigInt(0);
        let _handler_log = handler_default_;
        function _log_fxn(nr_logged, argsFn /* args */) {
            // console.log('_log_fxn: ', BigInt(nr_logged), _Bint_toggled, (BigInt(nr_logged) & _Bint_toggled));
            if ((BigInt(nr_logged) & _Bint_toggled) === BigInt(0))
                return;
            const args = argsFn();
            _handler_log.apply(this, args);
        }
        return {
            _id, // for testing
            get handler() { return _handler_log; },
            set handler(fx) {
                _handler_log = fx;
            },
            get toggled() { return _Bint_toggled; },
            // toggle(obj_labels, obj_toggled) {
            // 	_Bint_toggled= l_toBigInt_(obj_labels, obj_toggled);
            // },
            toggle(labels, obj_toggled) {
                const obj_labels = typeof labels?.get === 'function'
                    ? labels.get()
                    : labels;
                // console.log('obj_labels', obj_labels)
                _Bint_toggled = l_toBigInt_(obj_labels, obj_toggled);
            },
            // Core internal log function (exposed only to created loggers)
            _log_fxn,
            create(options = {}) {
                // This constant will be replaced at build time
                if (!(globalThis.LOGR_ENABLED ?? true)) {
                    return {
                        _obj_labels: undefined, // optional: keep shape compatible if needed
                        log: () => { }, // does nothing
                        raw: () => { }, // does nothing
                    };
                }
                const _logger = {
                    // _lref_labels: (options.arr_labels === undefined) ? undefined : lRef( l_array_(options.arr_labels) ),
                    _lref_labels: (options.labels === undefined)
                        ? undefined
                        : lRef(options.labels),
                    get l() {
                        // Always create a fresh proxy pointing to the current labels
                        return create_Referenced_l_({
                            get: () => this._lref_labels?.get() || {}
                        });
                    },
                    get lref() { return this._lref_labels; },
                    set lref(lref_labels_new) {
                        this._lref_labels = lref_labels_new;
                    },
                    log(nr_logged, argsFn) {
                        // This constant will be replaced at build time
                        if (!(globalThis.LOGR_ENABLED ?? true))
                            return;
                        _log_fxn.call(this, nr_logged, argsFn);
                    },
                    // Optional shorthand for common cases
                    raw(...args) {
                        _handler_log.apply(this, args);
                    }
                };
                return _logger;
            },
        };
    }
    // Public interface
    return {
        get_instance() {
            if (!(globalThis.LOGR_USE_GLOBAL_KEY ?? true)) {
                if (!_instance)
                    _instance = _create_instance(); // Lazy initialization
                return _instance;
            }
            if (!globalThis[GLOBAL_KEY])
                globalThis[GLOBAL_KEY] = _create_instance();
            return globalThis[GLOBAL_KEY];
        },
        // For testing only - reset the singleton
        _reset_for_testing() {
            delete globalThis[GLOBAL_KEY];
        }
    };
})();

const LOGR_= LOGR.get_instance();
const logr_= LOGR_.create({ labels: l_array_(['CONNECTIONS', 'REFLECTION']) });
const l_= logr_.l;
// console.log('OUT', __name({variableName}) );

//-------------------------------------------------------------------------------------------------

var cfg_= (function() {
    let _options= {};

    // options= {
    // channel : 'IPSME',
    //     prefix : '',
    //     logr : ...
    // }

    //TODO: prefix could be logr.prefix instead

    return {
        get channel() {
			return (_options.channel === undefined) ? 'IPSME' : _options.channel;
        },
        get prefix() { 
			return (_options.prefix === undefined) ? '' : _options.prefix;
        },
		get options() { return _options; },
		set options(obj) {
			_options= obj;
            // if (_options.logr && _options.logr[ __name(l_) ] )
			//     ...
		}
    }
})();

//-------------------------------------------------------------------------------------------------
// MsgEnv:

function subscribe(handler) {
    if (handler.broadcastChannel !== undefined)
        return;
    logr_.log(l_.CONNECTIONS, cfg_.prefix +'MsgEnv: subscribe');
    handler.broadcastChannel= new BroadcastChannel(cfg_.channel);
    handler.broadcastChannel.onmessage= function(event) {
        const msg= event.data;
        logr_.log(l_.REFLECTION, cfg_.prefix +'MsgEnv: bc.onmessage: ', msg);
        try { this(msg); }
        catch (e) { console.assert(false); }
    }.bind(handler);
}

function unsubscribe(handler) {
    logr_.log(l_.CONNECTIONS, cfg_.prefix +'MsgEnv: unsubscribe');
    handler.broadcastChannel.close();
    delete handler.broadcastChannel;
}

var bc_= undefined;

function publish(msg) {
    if (! bc_)
        bc_= new BroadcastChannel(cfg_.channel);

    logr_.log(l_.REFLECTION, cfg_.prefix +'MsgEnv: bc.postMessage: ', msg);
    bc_.postMessage(msg);
}

export { cfg_ as config, l_ as l, publish, subscribe, unsubscribe };
