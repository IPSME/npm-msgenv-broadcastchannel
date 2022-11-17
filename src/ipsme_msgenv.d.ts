declare const l_: {
    MsgEnv: number;
    CXNS: number;
    REFL: number;
};
declare var cfg_: {
    readonly channel: any;
    readonly prefix: any;
    options: {};
};
declare function subscribe(handler: any): void;
declare function unsubscribe(handler: any): void;
declare function publish(msg: any): void;
export { cfg_ as config, subscribe, unsubscribe, publish, l_ as l };
