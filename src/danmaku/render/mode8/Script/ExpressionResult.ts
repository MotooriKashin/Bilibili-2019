export class ExpressionResult {

    static createLiteral(param1: any): ExpressionResult {
        const _loc2_: ExpressionResult = new ExpressionResult();
        _loc2_.setTypeLiteral(param1);
        return _loc2_;
    }

    static createStack(): ExpressionResult {
        const _loc1_: ExpressionResult = new ExpressionResult();
        _loc1_.setTypeStack();
        return _loc1_;
    }

    type = 'empty';

    value: any;

    isLeftHandSide = false;

    constructor() {
        this.initialize();
    }

    clone(): ExpressionResult {
        const _loc1_: ExpressionResult = new ExpressionResult();
        _loc1_.setTypeAndValue(this.type, this.value);
        return _loc1_;
    }

    initialize() {
        this.type = 'empty';
        this.value = null;
    }

    setType(param1: string) {
        this.type = param1;
    }

    isType(param1: string) {
        return this.type == param1;
    }

    setValue(param1: any) {
        this.value = param1;
    }

    setTypeAndValue(param1: string, param2: any) {
        this.type = param1;
        this.value = param2;
    }

    isLiteral() {
        return this.isType("literal");
    }

    isVariableOrMember() {
        return this.isVariable() || this.isMember();
    }

    isVariable() {
        return this.isType("variable");
    }

    isMember() {
        return this.isType("member");
    }

    setTypeStack() {
        this.setType("stack");
    }

    setTypeLiteral(param1: any) {
        this.setTypeAndValue("literal", param1);
    }

    setTypeMember(param1: ExpressionResult, param2: ExpressionResult) {
        this.setTypeAndValue("member", {
            "object": param1,
            "member": param2
        });
    }

    getObjectExpression() {
        if (!this.isMember()) {
            return null;
        }
        return this.value.object;
    }

    getMemberExpression() {
        if (!this.isMember()) {
            return null;
        }
        return this.value.member;
    }
}