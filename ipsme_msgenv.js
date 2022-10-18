
//-------------------------------------------------------------------------------------------------
/*
// https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
//
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}
  
// console.log(uuidv4());
*/
//-------------------------------------------------------------------------------------------------

const CXN= 0b1 << 0;	// operations
const RDR= 0b1 << 1;	// redirect

var config= (function() {
    let _prefix= '';
    let _log= 0;

    return {
        get prefix() { return _prefix; },
        set prefix(prefix) {
            _prefix= prefix;
        },

        get log() { return _log; },
        set log(log) {
            _log= log;
        }
    }
})();

//-------------------------------------------------------------------------------------------------
// MsgEnv:

function subscribe(handler, prefix= undefined) {
    if (handler.broadcastChannel !== undefined)
        return;
    if (prefix !== undefined) 
        config.prefix= prefix;
    if (config.log&CXN) console.log(config.prefix +'MsgEnv: subscribe');
    handler.broadcastChannel= new BroadcastChannel('IPSME');
    handler.broadcastChannel.onmessage= function(event) {
        const msg= event.data;
        if (config.log&RDR) console.log(config.prefix +'MsgEnv: msg <- bc: ', msg);
        this(msg);
    }.bind(handler);
}

function unsubscribe(handler) {
    if (config.log&CXN) console.log(config.prefix +'MsgEnv: unsubscribe');
    handler.broadcastChannel.close();
    delete handler.broadcastChannel;
}

const bc= new BroadcastChannel('IPSME');

function publish(msg) {
    if (config.log&RDR) console.log(config.prefix +'MsgEnv: msg -> bc: ', msg);
	bc.postMessage(msg);
}

//-------------------------------------------------------------------------------------------------

export { config, subscribe, unsubscribe, publish };