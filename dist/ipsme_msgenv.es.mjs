// console.log('OUT', __name({variableName}) );

function l_toBigInt_(ref, obj, ignore= false) {
	console.assert(ref !== BigInt(0), 'no labels initialized');
	let bigInt = BigInt(0);
	for (const [k,v] of Object.entries(obj)) {
		if ( ( ignore || v ) && ref[k])
			bigInt|= BigInt( ref[k] );			
		// console.log('0b'+ bigInt.toString(2) );
	}
	return bigInt;
}

//-------------------------------------------------------------------------------------------------

function handler_default_( /* ... */ ) {
	// https://stackoverflow.com/questions/18746440/passing-multiple-arguments-to-console-log
	var args = Array.prototype.slice.call(arguments);
	console.log.apply(console, args);
}

//-------------------------------------------------------------------------------------------------
	
class BitLogr {
	constructor() {
		this._handler_log= handler_default_;
		this._Bint_labels= BigInt(0);
		this._Bint_toggled= BigInt(0);

		BitLogr.prototype['log']= function (nr_logged, /* ... */ ) {
			// console.log('NOP')
		};
	}

	set handler(fx) {
		this._handler_log= fx;
	}

	get labels() { return this._Bint_labels; }
	set labels(obj) {
		this._Bint_labels= obj;
		this._Bint_toggled= BigInt(0);
	}

	// put= function(label, abbrv) {
	// 	let name= __name(label);
	// 	_labels[name]= label[name];
	// 	console.log(_labels);
	// }

	get toggled() { return this._Bint_toggled; }
	set toggled(obj) {
		this._Bint_toggled= l_toBigInt_(this._Bint_labels, obj);

		if (this._Bint_toggled === BigInt(0)) {
			console.log('adlkjasdlfk');
			return;
		}

		BitLogr.prototype['log']= function (nr_logged, /* ... */ ) {
			if ( (BigInt(nr_logged) & this._Bint_toggled) === BigInt(0))
				return false;
		
			var args = Array.prototype.slice.call(arguments);
			args.shift(); // remove first arg: nr_logged
			this._handler_log.apply(this, args);
	
			return true;
		};
	}

	// log= function (nr_logged, /* ... */ ) {}
}

let LOGR_= new BitLogr();

const l_ = {
	MsgEnv : 0b1 << 0,	// MsgEnv
	CXNS : 0b1 << 1,	// connections
	REFL : 0b1 << 2,	// reflection
};
LOGR_.labels= l_;

// https://stackoverflow.com/questions/4602141/variable-name-as-a-string-in-javascript
const __name = obj => Object.keys(obj)[0];
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
            if (_options.logr && _options.logr[ __name(l_) ] )
			    LOGR_.toggled= _options.logr;
		}
    }
})();

//-------------------------------------------------------------------------------------------------
// MsgEnv:

function subscribe(handler) {
    if (handler.broadcastChannel !== undefined)
        return;
    LOGR_.log(l_.CXNS, cfg_.prefix +'MsgEnv: subscribe');
    handler.broadcastChannel= new BroadcastChannel(cfg_.channel);
    handler.broadcastChannel.onmessage= function(event) {
        const msg= event.data;
        LOGR_.log(l_.REFL, cfg_.prefix +'MsgEnv: bc.onmessage: ', msg);
        try { this(msg); }
        catch (e) { console.assert(false); }
    }.bind(handler);
}

function unsubscribe(handler) {
    LOGR_.log(l_.CXNS, cfg_.prefix +'MsgEnv: unsubscribe');
    handler.broadcastChannel.close();
    delete handler.broadcastChannel;
}

var bc_= undefined;

function publish(msg) {
    if (! bc_)
        bc_= new BroadcastChannel(cfg_.channel);

    LOGR_.log(l_.REFL, cfg_.prefix +'MsgEnv: bc.postMessage: ', msg);
    bc_.postMessage(msg);
}

export { cfg_ as config, l_ as l, publish, subscribe, unsubscribe };
