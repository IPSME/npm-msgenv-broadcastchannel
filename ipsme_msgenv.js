
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
// MsgEnv:

function subscribe(handler) {
    if (handler.broadcastChannel !== undefined)
        return;
    console.log('MsgEnv: subscribe');
    handler.broadcastChannel= new BroadcastChannel('IPSME');
    handler.broadcastChannel.onmessage= function(event) {
        // console.log('msgenv_BroadcastChannel.onmessage: ', event.data);
        this(event.data);
    }.bind(handler);
}

function unsubscribe(handler) {
    handler.broadcastChannel.close();
    delete handler.broadcastChannel;
}

const bc= new BroadcastChannel('IPSME');

function publish(msg) {
	bc.postMessage(msg);
}

//-------------------------------------------------------------------------------------------------

export { subscribe, unsubscribe, publish };