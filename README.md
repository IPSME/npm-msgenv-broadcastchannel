
# npm-msgenv-broadcastchannel

This library contains the wrapper code for sending messages to a web messaging environment (ME). As per the IPSME specification a reflector is required to reflect messages from this ME to other MEs e.g., the ME of the operating system.

> ### IPSME- Idempotent Publish/Subscribe Messaging Environment
> https://dl.acm.org/doi/abs/10.1145/3458307.3460966

#### Subscribing
```
function ipsme_handler_(msg) {
	console.log('ipsme_handler_: msg: ', msg);
	// add handlers here ...
	console.log("ipsme_handler_: DROP! msg: ", msg);
}

IPSME_MsgEnv.subscribe(ipsme_handler_);
```
It is by design that a participant receives the messages it has published itself. If this is not desirable, each message can contain a "referer" (sic) identifier and a clause added in the `ipsme_handler_` to drop those messages containing the participant's own referer id.

#### Publishing
```
IPSME_MsgEnv.publish( ... );
```

## Discussion

The ME utilized, as so mentioned in the name, is broadcast channel. This "library" is entirely optional. IPSME dictates the use of a readily available pubsub. That means the code is roughly equal to the following:

 #### Subscribing
```
const bc= new  BroadcastChannel('IPSME');
bc.onmessage= function(event) {
	const  msg= event.data;
	// add handlers here ...
}
```
I have chosen to use the 'IPSME' channel name although the IPSME specification doesn't divide communication into different channels; all IPSME participants receive all messages. Each channel is equal to a different ME with respect to the IPSME conventions.

#### Publishing
```
bc.postMessage(msg);
```
