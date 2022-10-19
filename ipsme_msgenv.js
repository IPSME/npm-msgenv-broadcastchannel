
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

var cfg_= (function() {
    let _prefix= '';
    let _logr= 0;

    return {
        get prefix() { return _prefix; },
        set prefix(str) {
            _prefix= str;
        },

        get logr() { return _logr; },
        set logr(nr) {
            _logr= nr;
        }
    }
})();

//-------------------------------------------------------------------------------------------------
// MsgEnv:

function subscribe(handler, prefix= undefined) {
    if (handler.broadcastChannel !== undefined)
        return;
    if (prefix !== undefined) 
        cfg_.prefix= prefix;
    if (cfg_.logr&CXN) console.log(cfg_.prefix +'MsgEnv: subscribe: new bc()');
    handler.broadcastChannel= new BroadcastChannel('IPSME');
    handler.broadcastChannel.onmessage= function(event) {
        const msg= event.data;
        if (cfg_.logr&RDR) console.log(cfg_.prefix +'MsgEnv: bc.onmessage: ', msg);
        this(msg);
    }.bind(handler);
}

function unsubscribe(handler) {
    if (cfg_.logr&CXN) console.log(cfg_.prefix +'MsgEnv: unsubscribe: bc.close()');
    handler.broadcastChannel.close();
    delete handler.broadcastChannel;
}

const bc= new BroadcastChannel('IPSME');

function publish(msg) {
    if (cfg_.logr&RDR) console.log(cfg_.prefix +'MsgEnv: bc.postMessage: ', msg);
	bc.postMessage(msg);
}

//-------------------------------------------------------------------------------------------------

export { cfg_ as config, subscribe, unsubscribe, publish };