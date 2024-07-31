import { DisplayObject } from "../Display/DisplayObject";

export class VirtualMachine {

    private programCounter = 1;

    private byteCode: any[] = [];

    private stack: any[] = [];

    private byteCodeLength = 0;

    private localObject: IGlobalValue;

    private thisObject: IGlobalValue;

    optimized = false;

    private returnValue: any;

    constructor(private global: IGlobalValue = { __scope: <any>null }) {
        this.localObject = global;
        this.thisObject = global;
    }

    rewind() {
        this.programCounter = 1;
    }

    setProgramCounter(param1: number) {
        this.programCounter = param1;
    }

    runCoroutine(param1: string, param2 = []) {
        return this.executeFunction(
            {},
            param2,
            this.global[param1].__entryPoint,
            this.global[param1].__scope
        )
    }

    getGlobalObject() {
        return this.global;
    }

    getLocalObject() {
        return this.localObject;
    }

    setByteCode(byteCode: string[]) {
        this.byteCode = byteCode;
        this.byteCodeLength = byteCode.length;
    }

    getByteCode() {
        return this.byteCode;
    }

    getByteCodeLength() {
        return this.byteCodeLength;
    }

    execute() {
        const byteCode = this.byteCode;
        let programCounter = this.programCounter;
        const byteCodeLength = this.byteCodeLength;
        let temp;
        if (this.optimized == false) {
            while (programCounter < byteCodeLength) {
                if ((temp = (<any>this)[byteCode[programCounter]](byteCode, programCounter)) == null) {
                    this.programCounter = programCounter + 1;
                    delete byteCode[0];
                    return true;
                }
                programCounter = temp;
            }
        } else {
            while (programCounter < byteCodeLength) {
                if ((temp = byteCode[programCounter](byteCode, programCounter)) == null) {
                    this.programCounter = programCounter + 1;
                    delete byteCode[0];
                    return true;
                }
                programCounter = temp;
            }
        }
        this.programCounter = programCounter;
        delete byteCode[0];
        return false;
    }

    executeFunction(
        thisObject: IGlobalValue,
        args: any[],
        programCounter: number,
        __scope: any,
    ) {
        const _loc6_ = this.thisObject;
        const _loc7_ = this.localObject;
        const _loc8_ = this.programCounter;
        this.thisObject = thisObject;
        this.localObject = {
            arguments: args,
            __scope
        };
        this.programCounter = programCounter;
        while (this.execute()) { }
        this.programCounter = _loc8_;
        this.localObject = _loc7_;
        this.thisObject = _loc6_;
        return this.returnValue;
    }

    private __resolve(param1: string) {
        throw new Error("VirtualMachine [UnknownOperation] : " + param1 + " at pc" + arguments[1]);
    }

    NOP = (code: any[], pc: number) => {
        return pc + 1;
    }

    SPD = (code: any[], pc: number) => {
        return null;
    }

    LIT = (code: any[], pc: number) => {
        code[code[pc + 2]] = code[pc + 1];
        return pc + 3;
    }

    CALL = (code: any[], pc: number) => {
        const _loc4_ = code[pc + 1];
        let _loc5_;
        let _loc6_: any = this.localObject;
        while (_loc6_ != null) {
            if (_loc6_.hasOwnProperty(_loc4_)) {
                _loc5_ = _loc6_[_loc4_];
                break;
            }
            _loc6_ = _loc6_.__scope;
        }
        let _loc7_ = code[pc + 2] + 1;
        const _loc8_ = this.stack;
        const _loc9_: any[] = [];
        while (--_loc7_) {
            _loc9_.push(_loc8_.pop());
        }
        _loc9_.reverse();
        if (_loc5_.hasOwnProperty("__entryPoint")) {
            _loc8_.push(pc + 4);
            _loc8_.push(this.thisObject);
            _loc8_.push(this.localObject);
            _loc8_.push(code[pc + 3]);
            this.thisObject = this.global;
            this.localObject = {
                "arguments": _loc9_,
                "__scope": _loc5_.__scope
            };
            return _loc5_.__entryPoint;
        }
        code[code[pc + 3]] = _loc5_.apply(this.global, _loc9_);
        return pc + 4;
    }

    CALLL = (code: any[], pc: number) => {
        const _loc4_ = this.localObject[code[pc + 1]];
        let _loc5_ = code[pc + 2] + 1;
        const _loc6_ = this.stack;
        const _loc7_: any[] = [];
        while (--_loc5_) {
            _loc7_.push(_loc6_.pop());
        }
        _loc7_.reverse();
        if (_loc4_.hasOwnProperty("__entryPoint")) {
            _loc6_.push(pc + 4);
            _loc6_.push(this.thisObject);
            _loc6_.push(this.localObject);
            _loc6_.push(code[pc + 3]);
            this.thisObject = this.global;
            this.localObject = {
                "arguments": _loc7_,
                "__scope": _loc4_.__scope
            };
            return _loc4_.__entryPoint;
        }
        code[code[pc + 3]] = _loc4_.apply(this.global, _loc7_);
        return pc + 4;
    }

    CALLM = (code: any[], pc: number) => {
        let _loc4_;
        const _loc5_ = (_loc4_ = code[pc + 1])[code[pc + 2]];
        let _loc6_ = code[pc + 3] + 1;
        const _loc7_ = this.stack;
        const _loc8_: any[] = [];
        while (--_loc6_) {
            _loc8_.push(_loc7_.pop());
        }
        _loc8_.reverse();
        if (_loc5_.hasOwnProperty("__entryPoint")) {
            _loc7_.push(pc + 5);
            _loc7_.push(this.thisObject);
            _loc7_.push(this.localObject);
            _loc7_.push(code[pc + 4]);
            this.thisObject = _loc4_;
            this.localObject = {
                "arguments": _loc8_,
                "__scope": _loc5_.__scope
            };
            return _loc5_.__entryPoint;
        }
        code[code[pc + 4]] = _loc5_.apply(_loc4_, _loc8_);
        return pc + 5;
    }

    CALLF = (code: any[], pc: number) => {
        const _loc4_ = code[pc + 1];
        let _loc5_ = code[pc + 2] + 1;
        const _loc6_ = this.stack;
        const _loc7_: any[] = [];
        while (--_loc5_) {
            _loc7_.push(_loc6_.pop());
        }
        _loc7_.reverse();
        if (_loc4_.hasOwnProperty("__entryPoint")) {
            _loc6_.push(pc + 4);
            _loc6_.push(this.thisObject);
            _loc6_.push(this.localObject);
            _loc6_.push(code[pc + 3]);
            this.thisObject = this.global;
            this.localObject = {
                "arguments": _loc7_,
                "__scope": _loc4_.__scope
            };
            return _loc4_.__entryPoint;
        }
        code[code[pc + 3]] = _loc4_.apply(this.global, _loc7_);
        return pc + 4;
    }

    RET = (code: any[], pc: number) => {
        this.returnValue = code[pc + 1];
        return this.byteCodeLength;
    }

    CRET = (code: any[], pc: number) => {
        const _loc3_ = this.stack;
        code[_loc3_.pop()] = code[pc + 1];
        this.localObject = _loc3_.pop();
        this.thisObject = _loc3_.pop();
        return Number(_loc3_.pop());
    }

    FUNC = (code: any[], pc: number) => {
        const entryPoint = pc + 3;
        const scope = this.localObject;
        const that = this;
        code[code[pc + 2]] = function (this: any) {
            return that.executeFunction(this, <any>arguments, entryPoint, scope);
        };
        return code[pc + 1];
    }

    COR = (code: any[], pc: number) => {
        code[code[pc + 2]] = {
            "__entryPoint": pc + 3,
            "__scope": this.localObject
        };
        return code[pc + 1];
    }

    ARG = (code: any[], pc: number) => {
        this.localObject[code[pc + 2]] = this.localObject.arguments[code[pc + 1]];
        if (this.localObject.parameters == undefined) {
            this.localObject.parameters = [];
        }
        this.localObject.parameters.push(code[pc + 2]);
        return pc + 3;
    }

    JMP = (code: any[], pc: number) => {
        return code[pc + 1];
    }

    IF = (code: any[], pc: number) => {
        if (code[pc + 1]) {
            return pc + 3;
        }
        return code[pc + 2];
    }

    NIF = (code: any[], pc: number) => {
        if (code[pc + 1]) {
            return code[pc + 2];
        }
        return pc + 3;
    }

    ADD = (code: any[], pc: number) => {
        code[code[pc + 3]] = code[pc + 1] + code[pc + 2];
        return pc + 4;
    }

    SUB = (code: any[], pc: number) => {
        code[code[pc + 3]] = code[pc + 1] - code[pc + 2];
        return pc + 4;
    }

    MUL = (code: any[], pc: number) => {
        code[code[pc + 3]] = code[pc + 1] * code[pc + 2];
        return pc + 4;
    }

    DIV = (code: any[], pc: number) => {
        code[code[pc + 3]] = code[pc + 1] / code[pc + 2];
        return pc + 4;
    }

    MOD = (code: any[], pc: number) => {
        code[code[pc + 3]] = code[pc + 1] % code[pc + 2];
        return pc + 4;
    }

    AND = (code: any[], pc: number) => {
        code[code[pc + 3]] = code[pc + 1] & code[pc + 2];
        return pc + 4;
    }

    OR = (code: any[], pc: number) => {
        code[code[pc + 3]] = code[pc + 1] | code[pc + 2];
        return pc + 4;
    }

    XOR = (code: any[], pc: number) => {
        code[code[pc + 3]] = code[pc + 1] ^ code[pc + 2];
        return pc + 4;
    }

    NOT = (code: any[], pc: number) => {
        code[code[pc + 2]] = ~code[pc + 1];
        return pc + 3;
    }

    LNOT = (code: any[], pc: number) => {
        code[code[pc + 2]] = !code[pc + 1];
        return pc + 3;
    }

    LSH = (code: any[], pc: number) => {
        code[code[pc + 3]] = code[pc + 1] << code[pc + 2];
        return pc + 4;
    }

    RSH = (code: any[], pc: number) => {
        code[code[pc + 3]] = code[pc + 1] >> code[pc + 2];
        return pc + 4;
    }

    URSH = (code: any[], pc: number) => {
        code[code[pc + 3]] = code[pc + 1] >>> code[pc + 2];
        return pc + 4;
    }

    INC = (code: any[], pc: number) => {
        code[code[pc + 2]] = code[pc + 1] + 1;
        return pc + 3;
    }

    DEC = (code: any[], pc: number) => {
        code[code[pc + 2]] = code[pc + 1] - 1;
        return pc + 3;
    }

    CEQ = (code: any[], pc: number) => {
        code[code[pc + 3]] = code[pc + 1] == code[pc + 2];
        return pc + 4;
    }

    CSEQ = (code: any[], pc: number) => {
        code[code[pc + 3]] = code[pc + 1] === code[pc + 2];
        return pc + 4;
    }

    CNE = (code: any[], pc: number) => {
        code[code[pc + 3]] = code[pc + 1] != code[pc + 2];
        return pc + 4;
    }

    CSNE = (code: any[], pc: number) => {
        code[code[pc + 3]] = code[pc + 1] !== code[pc + 2];
        return pc + 4;
    }

    CLT = (code: any[], pc: number) => {
        code[code[pc + 3]] = code[pc + 1] < code[pc + 2];
        return pc + 4;
    }

    CGT = (code: any[], pc: number) => {
        code[code[pc + 3]] = code[pc + 1] > code[pc + 2];
        return pc + 4;
    }

    CLE = (code: any[], pc: number) => {
        code[code[pc + 3]] = code[pc + 1] <= code[pc + 2];
        return pc + 4;
    }

    CGE = (code: any[], pc: number) => {
        code[code[pc + 3]] = code[pc + 1] >= code[pc + 2];
        return pc + 4;
    }

    DUP = (code: any[], pc: number) => {
        const _loc3_ = code[pc + 1];
        code[code[pc + 2]] = _loc3_;
        code[code[pc + 3]] = _loc3_;
        return pc + 4;
    }

    THIS = (code: any[], pc: number) => {
        code[code[pc + 1]] = this.thisObject;
        return pc + 2;
    }

    ARRAY = (code: any[], pc: number) => {
        const _loc3_ = code[pc + 1];
        const _loc4_ = new Array(_loc3_);
        const _loc5_ = this.stack;
        let _loc6_ = 0;
        while (_loc6_ < _loc3_) {
            _loc4_[_loc6_] = _loc5_.pop();
            _loc6_++;
        }
        _loc4_.reverse();
        code[code[pc + 2]] = _loc4_;
        return pc + 3;
    }

    OBJ = (code: any[], pc: number) => {
        let _loc7_;
        const _loc3_ = code[pc + 1];
        let _loc4_: any = {};
        const _loc5_ = this.stack;
        let _loc6_ = 0;
        while (_loc6_ < _loc3_) {
            _loc7_ = _loc5_.pop();
            _loc4_[_loc5_.pop()] = _loc7_;
            _loc6_++;
        }
        code[code[pc + 2]] = _loc4_;
        return pc + 3;
    }

    SETL = (code: any[], pc: number) => {
        if (String(code[pc + 1]) == "__scope") {
            throw new Error("不能用  __scope!");
        }
        this.localObject[code[pc + 1]] = code[code[pc + 3]] = code[pc + 2];
        return pc + 4;
    }

    GETL = (code: any[], pc: number) => {
        code[code[pc + 2]] = this.localObject[code[pc + 1]];
        return pc + 3;
    }

    SET = (code: any[], pc: number) => {
        const _loc3_ = code[pc + 1];
        if (_loc3_ == "__scope") {
            throw new Error("不能用  __scope!");
        }
        let _loc4_ = this.localObject;
        while (_loc4_ != null) {
            if (_loc4_.hasOwnProperty(_loc3_)) {
                _loc4_[_loc3_] = code[code[pc + 3]] = code[pc + 2];
                return pc + 4;
            }
            _loc4_ = _loc4_.__scope!;
        }
        this.global[_loc3_] = code[code[pc + 3]] = code[pc + 2];
        return pc + 4;
    }

    GET = (code: any[], pc: number) => {
        const _loc3_ = code[pc + 1];
        let _loc4_ = this.localObject;
        while (_loc4_ != null) {
            if (_loc4_.hasOwnProperty(_loc3_)) {
                code[code[pc + 2]] = _loc4_[_loc3_];
                return pc + 3;
            }
            _loc4_ = _loc4_.__scope!;
        }
        code[code[pc + 2]] = undefined;
        return pc + 3;
    }

    SETM = (code: any[], pc: number) => {
        if (String(code[pc + 2]) == "__scope") {
            throw new Error("不能用  __scope!");
        }
        code[pc + 1][code[pc + 2]] = code[code[pc + 4]] = code[pc + 3];
        return pc + 5;
    }

    GETM = (code: any[], pc: number) => {
        let _loc3_ = String(code[pc + 2]);
        if (code[pc + 1] instanceof DisplayObject) {
            // 移植后的沙盒这些属性是手动构造的，允许访问~
            // if (_loc3_ == "root" || _loc3_ == "parent" || _loc3_ == "stage") {
            //     throw new Error("属性禁止访问！(禁止向上访问播放器的显示列表)");
            // }
            if (_loc3_ == "loaderInfo") {
                throw new Error("属性无法访问。");
            }
        }
        code[code[pc + 3]] = code[pc + 1][_loc3_];
        return pc + 4;
    }

    GETMV = (code: any[], pc: number) => {
        let _loc3_;
        let _loc4_;
        if (code[pc + 2] == "GETL") {
            _loc3_ = this.localObject[code[pc + 3]];
        }
        else {
            _loc4_ = this.localObject;
            while (_loc4_ != null) {
                if (_loc4_.hasOwnProperty(code[pc + 3])) {
                    _loc3_ = _loc4_[code[pc + 3]];
                }
                _loc4_ = _loc4_.__scope;
            }
        }
        if (code[pc + 1] instanceof DisplayObject) {
            if (typeof _loc3_ !== "number") {
                _loc3_ = String(_loc3_);
            }
            // 移植后的沙盒这些属性是手动构造的，允许访问~
            // if (_loc3_ == "root" || _loc3_ == "parent" || _loc3_ == "stage") {
            //     throw new Error("属性禁止访问！(禁止向上访问播放器的显示列表)");
            // }
            if (_loc3_ == "loaderInfo") {
                throw new Error("属性无法访问。");
            }
        }
        code[code[pc + 4]] = code[pc + 1][_loc3_];
        return pc + 5;
    }

    NEW = (code: any[], pc: number) => {
        const _loc3_: Function = code[pc + 1];
        this._constructor.prototype = _loc3_.prototype;
        const _loc4_ = _loc3_;
        let _loc5_ = code[pc + 2] + 1;
        const _loc6_ = this.stack;
        const _loc7_: any[] = [];
        while (--_loc5_) {
            _loc7_.push(_loc6_.pop());
        }
        code[code[pc + 3]] = _loc3_.apply(_loc4_, _loc7_) || _loc4_;
        return pc + 4;
    }

    private _constructor() { }

    DEL = (code: any[], pc: number) => {
        const _loc3_ = code[pc + 1];
        let _loc4_ = this.localObject;
        while (_loc4_ != null) {
            if (_loc4_.hasOwnProperty(_loc3_)) {
                code[code[pc + 2]] = delete _loc4_[_loc3_];
                return pc + 3;
            }
            _loc4_ = _loc4_.__scope!;
        }
        code[code[pc + 2]] = false;
        return pc + 3;
    }

    DELL = (code: any[], pc: number) => {
        code[code[pc + 2]] = delete this.localObject[code[pc + 1]];
        return pc + 3;
    }

    DELM = (code: any[], pc: number) => {
        code[code[pc + 3]] = delete code[pc + 1][code[pc + 2]];
        return pc + 4;
    }

    TYPEOF = (code: any[], pc: number) => {
        code[code[pc + 2]] = typeof code[pc + 1];
        return pc + 3;
    }

    INSOF = (code: any[], pc: number) => {
        code[code[pc + 3]] = code[pc + 1] instanceof code[pc + 2];
        return pc + 4;
    }

    NUM = (code: any[], pc: number) => {
        code[code[pc + 2]] = Number(code[pc + 1]);
        return pc + 3;
    }

    STR = (code: any[], pc: number) => {
        code[code[pc + 2]] = String(code[pc + 1]);
        return pc + 3;
    }

    WITH = (code: any[], pc: number) => {
        const _loc3_ = code[pc + 1];
        _loc3_.__scope = this.localObject;
        this.localObject = _loc3_;
        return pc + 2;
    }

    EWITH = (code: any[], pc: number) => {
        this.localObject = this.localObject.__scope!;
        return pc + 1;
    }

    PUSH = (code: any[], pc: number) => {
        this.stack.push(code[pc + 1]);
        return pc + 2;
    }

    POP = (code: any[], pc: number) => {
        code[code[pc + 1]] = this.stack.pop();
        return pc + 2;
    }
}

interface IGlobalValue {
    __entryPoint?: unknown;
    __scope?: IGlobalValue;
    [key: string]: any;
}