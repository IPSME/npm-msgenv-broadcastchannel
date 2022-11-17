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

export { cfg_ as config, l_ as l, publish, subscribe, unsubscribe };
