
import { BitLogr } from '@knev/bitlogr';

let LOGR_= new BitLogr();

const l_ = {
	MsgEnv : 0b1 << 0,	// MsgEnv
	CXNS : 0b1 << 1,	// connections
	REFL : 0b1 << 2,	// reflection
}
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
			    LOGR_.toggled= _options.logr
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
        this(msg);
    }.bind(handler);
}

function unsubscribe(handler) {
    LOGR_.log(l_.CXNS, cfg_.prefix +'MsgEnv: unsubscribe');
    handler.broadcastChannel.close();
    delete handler.broadcastChannel;
}

var bc_= undefined;

function publish(msg) {
    "use strict";
    if (! bc_)
        bc_= new BroadcastChannel(cfg_.channel);

    LOGR_.log(l_.REFL, cfg_.prefix +'MsgEnv: bc.postMessage: ', msg);
    bc_.postMessage(msg);
}

//-------------------------------------------------------------------------------------------------

export { cfg_ as config, subscribe, unsubscribe, publish, l_ as l };
