
import { LOGR } from '@knev/bitlogr';

const l_ = {
    CONNECTIONS : 0b1 << 1,	// connections
	REFLECTION : 0b1 << 2,	// reflection
}

const LOGR_= LOGR.get_instance();
const logr_= LOGR_.create({ labels: l_ });

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
        try { this(msg) }
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
    "use strict";
    if (! bc_)
        bc_= new BroadcastChannel(cfg_.channel);

    logr_.log(l_.REFLECTION, cfg_.prefix +'MsgEnv: bc.postMessage: ', msg);
    bc_.postMessage(msg);
}

//-------------------------------------------------------------------------------------------------

export { 
    cfg_ as config, 
    subscribe, 
    unsubscribe, 
    publish, 
    l_ as l 
};
