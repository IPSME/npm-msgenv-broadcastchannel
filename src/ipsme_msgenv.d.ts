declare var cfg_: {
    readonly channel: any;
    readonly prefix: any;
    options: {};
};
declare function subscribe(handler: any): void;
declare function unsubscribe(handler: any): void;
declare function publish(msg: any): void;
declare const logr_: any;
export { cfg_ as config, subscribe, unsubscribe, publish, logr_ as logr };
