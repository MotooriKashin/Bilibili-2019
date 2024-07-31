import { ExpressionResult } from "./ExpressionResult";
import { Label } from "./Label";
import { VirtualMachine } from "./VirtualMachine";

export class CodeGenerator {

    private code: any[] = [];

    private stackList: any[] = [];

    private localVariableList: any[] = [];

    vmtarget?: VirtualMachine;

    constructor() {
        this.initialize();
    }

    initialize() {
        this.code = [];
        this.stackList = [];
        this.localVariableList = [];
        this.put(null);
        this.beginNewScope();
    }

    private error(param1: string) {
        throw new Error("CodeGenerator [error] " + param1);
    }

    getCode() {
        return this.code;
    }

    put(param1: any) {
        return this.code.push(param1) - 1;
    }

    putStoreStack() {
        this.stackList.push(this.put(null));
    }

    putLoadStack() {
        let _loc3_;
        const _loc1_ = this.code;
        let _loc2_ = Number(this.stackList.pop());
        const _loc4_ = this.put(null);
        while (true) {
            _loc3_ = _loc1_[_loc2_];
            _loc1_[_loc2_] = _loc4_;
            if (_loc3_ == null) {
                break;
            }
            _loc2_ = _loc3_;
        }
    }

    popStack() {
        return Number(this.stackList.pop());
    }

    pushStack(param1: any) {
        this.stackList.push(param1);
    }

    setStackPatch(param1: any) {
        if (this.code[this.stackList[this.stackList.length - 1]] != null) {
            this.setStackPatchRecursive(this.code[this.stackList[this.stackList.length - 1]], param1);
        }
        else {
            this.code[this.stackList[this.stackList.length - 1]] = param1;
        }
    }

    setStackPatchRecursive(param1: any, param2: any) {
        if (this.code[param1] == null) {
            this.code[param1] = param2;
        }
        else {
            this.setStackPatchRecursive(this.code[param1], param2);
        }
    }

    putCrossLoadStack() {
        this.swapStack();
        this.putLoadStack();
        this.putLoadStack();
    }

    swapStack(param1?: any, param2?: any) {
        param1 = this.stackList.length - (param1 !== undefined ? param1 : 0) - 1;
        param2 = this.stackList.length - (param2 !== undefined ? param2 : 1) - 1;
        const _loc3_ = this.stackList[param1];
        this.stackList[param1] = this.stackList[param2];
        this.stackList[param2] = _loc3_;
    }

    getStackLength() {
        return this.stackList.length;
    }

    cleanUpStack(param1: any) {
        if (param1 === undefined) {
            param1 = 0;
        }
        const _loc2_ = this.stackList;
        while (_loc2_.length > param1) {
            this.popAndDestroyStack();
        }
    }

    popAndDestroyStack() {
        let _loc3_;
        const _loc1_ = this.code;
        let _loc2_ = Number(this.stackList.pop());
        while (true) {
            _loc3_ = _loc1_[_loc2_];
            _loc1_[_loc2_] = 0;
            if (_loc3_ == null) {
                break;
            }
            _loc2_ = _loc3_;
        }
    }

    putLabel(param1: Label) {
        if (param1.isExists) {
            this.put(param1.address);
        }
        else {
            param1.address = this.put(param1.address);
        }
    }

    setLabel(param1: Label) {
        const _loc2_ = this.code.length;
        this.setLabelAddress(param1, _loc2_);
        param1.commitAddress(_loc2_);
    }

    setLabelAddress(param1: Label, param2: any) {
        let _loc5_ = undefined;
        const _loc3_ = this.code;
        let _loc4_ = param1.address;
        while (_loc4_ != null) {
            _loc5_ = _loc3_[_loc4_];
            _loc3_[_loc4_] = param2;
            _loc4_ = _loc5_;
        }
    }

    beginNewScope() {
        this.localVariableList.unshift({});
    }

    closeScope() {
        this.localVariableList.shift();
    }

    isLocalVariable(param1: any) {
        return this.localVariableList[0].hasOwnProperty(String(param1));
    }

    addLocalVariable(param1: any) {
        this.localVariableList[0][param1] = true;
    }

    putExpressionResult(param1: ExpressionResult) {
        switch (param1.type) {
            case "variable":
                this.putGetVariable(String(param1.value));
                param1.setType("stack");
                break;
            case "member":
                this.putGetMember(param1.getObjectExpression(), param1.getMemberExpression());
                param1.setType("stack");
        }
    }

    private putValue(param1: ExpressionResult) {
        switch (param1.type) {
            case "literal":
                this.put(param1.value);
                break;
            case "stack":
                this.putLoadStack();
                break;
            default:
                this.error("putValueError");
        }
    }

    private putBinaryValue(param1: ExpressionResult, param2: ExpressionResult) {
        if (param1.isType("literal") && param2.isType("literal")) {
            this.put(param1.value);
            this.put(param2.value);
        }
        else if (param1.isType("stack") && param2.isType("stack")) {
            this.putCrossLoadStack();
        }
        else if (param1.isType("stack")) {
            this.putLoadStack();
            this.put(param2.value);
        }
        else if (param2.isType("stack")) {
            this.put(param1.value);
            this.putLoadStack();
        }
        else {
            this.error("putBinaryValueError");
        }
    }

    putSuspend() {
        this.put(this.vmtarget == null ? "SPD" : this.vmtarget.SPD);
    }

    putLiteral(param1: ExpressionResult) {
        this.put(this.vmtarget == null ? "LIT" : this.vmtarget.LIT);
        this.put(param1.value);
        this.putStoreStack();
    }

    putCall(param1: ExpressionResult, param2: any) {
        if (this.isLocalVariable(param1.value)) {
            this.put(this.vmtarget == null ? "CALLL" : this.vmtarget.CALLL);
        }
        else {
            this.put(this.vmtarget == null ? "CALL" : this.vmtarget.CALL);
        }
        this.put(param1.value);
        this.put(param2);
        this.putStoreStack();
    }

    putCallMember(param1: ExpressionResult, param2: ExpressionResult, param3: any) {
        this.put(this.vmtarget == null ? "CALLM" : this.vmtarget.CALLM);
        this.putBinaryValue(param1, param2);
        this.put(param3);
        this.putStoreStack();
    }

    putCallFunctor(param1: any) {
        this.put(this.vmtarget == null ? "CALLF" : this.vmtarget.CALLF);
        this.putLoadStack();
        this.put(param1);
        this.putStoreStack();
    }

    putReturnFunction(param1: ExpressionResult) {
        this.put(this.vmtarget == null ? "RET" : this.vmtarget.RET);
        this.putValue(param1);
    }

    putReturnCoroutine(param1: ExpressionResult) {
        this.put(this.vmtarget == null ? "CRET" : this.vmtarget.CRET);
        this.putValue(param1);
    }

    putFunction() {
        const _loc1_ = new Label();
        this.put(this.vmtarget == null ? "FUNC" : this.vmtarget.FUNC);
        this.putLabel(_loc1_);
        this.putStoreStack();
        return _loc1_;
    }

    putCoroutine() {
        const _loc1_ = new Label();
        this.put(this.vmtarget == null ? "COR" : this.vmtarget.COR);
        this.putLabel(_loc1_);
        this.putStoreStack();
        return _loc1_;
    }

    putArgument(param1: any, param2: string) {
        this.put(this.vmtarget == null ? "ARG" : this.vmtarget.ARG);
        this.put(param1);
        this.put(param2);
        this.addLocalVariable(param2);
    }

    putJump(param1: Label) {
        this.put(this.vmtarget == null ? "JMP" : this.vmtarget.JMP);
        this.putLabel(param1);
    }

    putIf(param1: ExpressionResult, param2: Label) {
        this.put(this.vmtarget == null ? "IF" : this.vmtarget.IF);
        this.putValue(param1);
        this.putLabel(param2);
    }

    putNif(param1: ExpressionResult, param2: Label) {
        this.put(this.vmtarget == null ? "NIF" : this.vmtarget.NIF);
        this.putValue(param1);
        this.putLabel(param2);
    }

    putBinaryOperation(param1: any, param2: ExpressionResult, param3: ExpressionResult) {
        this.put(param1);
        this.putBinaryValue(param2, param3);
        this.putStoreStack();
    }

    putUnaryOperation(param1: any, param2: ExpressionResult) {
        this.put(param1);
        this.putValue(param2);
        this.putStoreStack();
    }

    putIncrement(param1: ExpressionResult) {
        this.putIncDec(this.vmtarget == null ? "INC" : this.vmtarget.INC, false, param1);
    }

    putDecrement(param1: ExpressionResult) {
        this.putIncDec(this.vmtarget == null ? "DEC" : this.vmtarget.DEC, false, param1);
    }

    putPostfixIncrement(param1: ExpressionResult) {
        this.putIncDec(this.vmtarget == null ? "INC" : this.vmtarget.INC, true, param1);
    }

    putPostfixDecrement(param1: ExpressionResult) {
        this.putIncDec(this.vmtarget == null ? "DEC" : this.vmtarget.DEC, true, param1);
    }

    private putIncDec(param1: any, param2: Boolean, param3: ExpressionResult) {
        let _loc4_;
        let _loc5_: ExpressionResult;
        let _loc6_: ExpressionResult;
        let _loc7_: String;
        switch (param3.type) {
            case "member":
                _loc5_ = param3.getObjectExpression();
                if (!(_loc6_ = param3.getMemberExpression()).isLiteral()) {
                    this.putExpressionResult(_loc6_);
                    _loc4_ = this.popStack();
                    this.putDuplicate(_loc6_);
                    this.pushStack(_loc4_);
                    this.putDuplicate(_loc5_);
                    this.swapStack(1, 2);
                }
                else {
                    this.putDuplicate(_loc5_);
                }
                this.putGetMember(_loc5_, _loc6_);
                param3.setTypeStack();
                if (param2) {
                    this.putDuplicate(param3);
                    _loc4_ = this.popStack();
                    this.putUnaryOperation(param1, param3);
                    this.putSetMember(_loc5_, _loc6_, param3);
                    this.popAndDestroyStack();
                    this.pushStack(_loc4_);
                }
                else {
                    this.putUnaryOperation(param1, param3);
                    this.putSetMember(_loc5_, _loc6_, param3);
                }
                break;
            case "variable":
                _loc7_ = String(param3.value);
                this.putGetVariable(_loc7_);
                param3.setTypeStack();
                if (param2) {
                    this.putDuplicate(param3);
                }
                this.putUnaryOperation(param1, param3);
                this.putSetVariable(_loc7_, param3);
                if (param2) {
                    this.popAndDestroyStack();
                }
                break;
            default:
                this.error("putIncDecError");
        }
    }

    putWith(param1: ExpressionResult) {
        this.put(this.vmtarget == null ? "WITH" : this.vmtarget.WITH);
        this.putValue(param1);
    }

    putEndWith() {
        this.put(this.vmtarget == null ? "EWITH" : this.vmtarget.EWITH);
    }

    putPush(param1: ExpressionResult) {
        this.put(this.vmtarget == null ? "PUSH" : this.vmtarget.PUSH);
        this.putValue(param1);
    }

    putPop() {
        this.put(this.vmtarget == null ? "POP" : this.vmtarget.POP);
        this.putStoreStack();
    }

    putDuplicate(param1: ExpressionResult) {
        this.put(this.vmtarget == null ? "DUP" : this.vmtarget.DUP);
        this.putValue(param1);
        this.putStoreStack();
        this.putStoreStack();
    }

    putThis() {
        this.put(this.vmtarget == null ? "THIS" : this.vmtarget.THIS);
        this.putStoreStack();
    }

    putArrayLiteral(param1: any) {
        this.put(this.vmtarget == null ? "ARRAY" : this.vmtarget.ARRAY);
        this.put(param1);
        this.putStoreStack();
    }

    putObjectLiteral(param1: any) {
        this.put(this.vmtarget == null ? "OBJ" : this.vmtarget.OBJ);
        this.put(param1);
        this.putStoreStack();
    }

    putGetVariable(param1: String) {
        if (this.isLocalVariable(param1)) {
            this.put(this.vmtarget == null ? "GETL" : this.vmtarget.GETL);
        }
        else {
            this.put(this.vmtarget == null ? "GET" : this.vmtarget.GET);
        }
        this.put(param1);
        this.putStoreStack();
    }

    putSetVariable(param1: String, param2: ExpressionResult) {
        if (this.isLocalVariable(param1)) {
            this.put(this.vmtarget == null ? "SETL" : this.vmtarget.SETL);
        }
        else {
            this.put(this.vmtarget == null ? "SET" : this.vmtarget.SET);
        }
        this.put(param1);
        this.putValue(param2);
        this.putStoreStack();
    }

    putSetLocalVariable(param1: String, param2: ExpressionResult) {
        this.put(this.vmtarget == null ? "SETL" : this.vmtarget.SETL);
        this.put(param1);
        this.putValue(param2);
        this.putStoreStack();
        this.addLocalVariable(param1);
    }

    putGetMember(param1: ExpressionResult, param2: ExpressionResult) {
        if (param2.isType("variable")) {
            this.put(this.vmtarget == null ? "GETMV" : this.vmtarget.GETMV);
            if (param1.isType("literal")) {
                this.put(param1.value);
            }
            else {
                this.putLoadStack();
            }
            if (this.isLocalVariable(param2.value)) {
                this.put(this.vmtarget == null ? "GETL" : this.vmtarget.GETL);
            }
            else {
                this.put(this.vmtarget == null ? "GET" : this.vmtarget.GET);
            }
            this.put(param2.value);
            this.putStoreStack();
        }
        else {
            this.put(this.vmtarget == null ? "GETM" : this.vmtarget.GETM);
            this.putBinaryValue(param1, param2);
            this.putStoreStack();
        }
    }

    putSetMember(param1: ExpressionResult, param2: ExpressionResult, param3: ExpressionResult) {
        this.put(this.vmtarget == null ? "SETM" : this.vmtarget.SETM);
        if (param1.isLiteral()) {
            if (param2.isLiteral()) {
                if (param3.isLiteral()) {
                    this.put(param1.value);
                    this.put(param2.value);
                    this.put(param3.value);
                }
                else {
                    this.put(param1.value);
                    this.put(param2.value);
                    this.putLoadStack();
                }
            }
            else if (param3.isLiteral()) {
                this.put(param1.value);
                this.putLoadStack();
                this.put(param3.value);
            }
            else {
                this.put(param1.value);
                this.putCrossLoadStack();
            }
        }
        else if (param2.isLiteral()) {
            if (param3.isLiteral()) {
                this.putLoadStack();
                this.put(param2.value);
                this.put(param3.value);
            }
            else {
                this.swapStack(undefined, undefined);
                this.putLoadStack();
                this.put(param2.value);
                this.putLoadStack();
            }
        }
        else if (param3.isLiteral()) {
            this.putCrossLoadStack();
            this.put(param3.value);
        }
        else {
            this.swapStack(0, 2);
            this.putLoadStack();
            this.putLoadStack();
            this.putLoadStack();
        }
        this.putStoreStack();
    }

    putNew(param1: any) {
        this.put(this.vmtarget == null ? "NEW" : this.vmtarget.NEW);
        this.putLoadStack();
        this.put(param1);
        this.putStoreStack();
    }

    putDelete(param1: ExpressionResult) {
        if (param1.isType("variable") || param1.isType("literal")) {
            if (this.isLocalVariable(param1.value)) {
                this.put(this.vmtarget == null ? "DELL" : this.vmtarget.DELL);
            }
            else {
                this.put(this.vmtarget == null ? "DEL" : this.vmtarget.DEL);
            }
            this.put(param1.value);
            this.putStoreStack();
        }
        else {
            this.put(this.vmtarget == null ? "DEL" : this.vmtarget.DEL);
            this.putLoadStack();
            this.putStoreStack();
        }
    }

    putDeleteMember(param1: ExpressionResult, param2: ExpressionResult) {
        this.put(this.vmtarget == null ? "DELM" : this.vmtarget.DELM);
        this.putBinaryValue(param1, param2);
        this.putStoreStack();
    }
}