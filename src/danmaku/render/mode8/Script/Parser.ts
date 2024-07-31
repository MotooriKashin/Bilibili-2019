import { CodeGenerator } from "./CodeGenerator";
import { ExpressionResult } from "./ExpressionResult";
import { Label } from "./Label";
import { Scanner } from "./Scanner";
import { Token } from "./Token";
import { VMSyntaxError } from "./VMSyntaxError";
import { VirtualMachine } from "./VirtualMachine";

export class Parser {

    private token!: Token;

    private functionStack: any[] = [];

    private continueLabelList: Label[] = [];

    private breakLabelList: Label[] = [];

    private generator!: CodeGenerator;

    private parseForceCoroutine = false;

    private lastReturnCaution = 0;

    private vmtarget?: VirtualMachine;

    private hasLastReturn!: boolean;

    constructor(private scanner: Scanner) { }

    private getToken() {
        return this.token;
    }

    private nextToken() {
        return this.token = this.scanner.getToken();
    }

    private isToken(param1: string) {
        if (this.token == null) {
            return false;
        }
        return this.token.type == param1;
    }

    private isNextToken(param1: string) {
        return this.nextToken().type == param1;
    }

    private initialize() {
        this.scanner.rewind();
        this.generator = new CodeGenerator();
        this.breakLabelList = [];
        this.continueLabelList = [];
        this.functionStack = [];
        this.nextToken();
    }

    setForceCoroutine(param1: boolean) {
        this.parseForceCoroutine = param1;
    }

    parse(param1: VirtualMachine) {
        this.initialize();
        if (param1 != null) {
            this.generator.vmtarget = param1;
            this.generator.vmtarget.optimized = true;
            this.vmtarget = param1;
        }
        this.parse_program();
        return this.generator.getCode();
    }

    private causeSyntaxError(param1: string) {
        throw new VMSyntaxError("Parser [causeSyntaxError] on line " + this.scanner.getLineNumber() + " " + param1 + " (" + this.getToken()?.type + ")" + " " + this.scanner.getLine());
    }

    private pushBreakLabel(param1: Label) {
        this.breakLabelList.unshift(param1);
    }

    private popBreakLabel() {
        return this.breakLabelList.shift();
    }

    private getBreakLabel() {
        if (this.breakLabelList.length < 1) {
            this.causeSyntaxError("break cannot be used here");
        }
        return this.breakLabelList[0];
    }

    private pushContinueLabel(param1: Label) {
        this.continueLabelList.unshift(param1);
    }

    private popContinueLabel() {
        return this.continueLabelList.shift();
    }

    private getContinueLabel() {
        if (this.continueLabelList.length < 1) {
            this.causeSyntaxError("continue cannot be used here");
        }
        return this.continueLabelList[0];
    }

    private beginFunction() {
        this.functionStack.unshift(true);
    }

    private endFunction() {
        this.functionStack.shift();
    }

    private beginCoroutine() {
        this.functionStack.unshift(false);
    }

    private endCoroutine() {
        this.functionStack.shift();
    }

    private isAllowReturn() {
        return this.functionStack.length > 0;
    }

    private isInFunction() {
        return this.functionStack.length > 0 && this.functionStack[0];
    }

    private parse_program() {
        this.parse_sourceElements();
    }

    private parse_sourceElements() {
        this.parse_sourceElement();
        while (this.getToken() != null) {
            if (this.isToken("}")) {
                return;
            }
            this.parse_sourceElement();
        }
    }

    private parse_sourceElement() {
        if (this.isToken("function")) {
            if (this.parseForceCoroutine == true) {
                this.token!.type = "coroutine";
                this.parse_coroutineDeclaration();
            }
            else {
                this.parse_functionDeclaration();
            }
        }
        else if (this.isToken("coroutine")) {
            this.parse_coroutineDeclaration();
        }
        else if (this.isStatementFirst(this.getToken()?.type)) {
            this.parse_statement();
        }
        else {
            this.causeSyntaxError("SourceElement found an unexpected token");
        }
    }

    private parse_functionDeclaration() {
        if (!this.isToken("function")) {
            this.causeSyntaxError("\'function\' not found in function declaration");
        }
        if (!this.isNextToken("identifier")) {
            this.causeSyntaxError("function name not found in function declaration");
        }
        const _loc1_ = String(this.getToken().value);
        const _loc2_ = this.generator.putFunction();
        this.beginFunction();
        this.generator.beginNewScope();
        if (!this.isNextToken("(")) {
            this.causeSyntaxError("\'(\' not found in function declaration");
        }
        if (this.isNextToken("identifier")) {
            this.parse_formalParameterList();
        }
        if (!this.isToken(")")) {
            this.causeSyntaxError("\')\' not found in function declaration");
        }
        if (!this.isNextToken("{")) {
            this.causeSyntaxError("\'{\' not found in function declaration");
        }
        if (!this.isNextToken("}")) {
            this.parse_functionBody();
        }
        if (!this.hasLastReturn) {
            this.generator.putReturnFunction(ExpressionResult.createLiteral(undefined));
        }
        if (!this.isToken("}")) {
            this.causeSyntaxError("\'}\' not found in function declaration");
        }
        this.endFunction();
        this.generator.closeScope();
        this.generator.setLabel(_loc2_);
        this.generator.putSetLocalVariable(_loc1_, ExpressionResult.createStack());
        this.generator.popAndDestroyStack();
        this.nextToken();
    }

    private parse_functionExpression(param1: ExpressionResult) {
        if (!this.isToken("function")) {
            this.causeSyntaxError("\'function\' not found in function expression");
        }
        let _loc2_;
        if (this.isNextToken("identifier")) {
            _loc2_ = String(this.getToken().value);
            this.nextToken();
        }
        const _loc3_ = this.generator.putFunction();
        this.beginFunction();
        this.generator.beginNewScope();
        if (!this.isToken("(")) {
            this.causeSyntaxError("\'(\' not found in function expression");
        }
        if (this.isNextToken("identifier")) {
            this.parse_formalParameterList();
        }
        if (!this.isToken(")")) {
            this.causeSyntaxError("\')\' not found in function expression");
        }
        if (!this.isNextToken("{")) {
            this.causeSyntaxError("\'{\' not found in function expression");
        }
        if (!this.isNextToken("}")) {
            this.parse_functionBody();
        }
        if (!this.hasLastReturn) {
            this.generator.putReturnFunction(ExpressionResult.createLiteral(undefined));
        }
        if (!this.isToken("}")) {
            this.causeSyntaxError("\'}\' not found in function expression");
        }
        this.generator.closeScope();
        this.endFunction();
        this.generator.setLabel(_loc3_);
        if (_loc2_ != null) {
            this.generator.putSetLocalVariable(_loc2_, ExpressionResult.createStack());
        }
        param1.setTypeStack();
        this.nextToken();
    }

    private parse_coroutineDeclaration() {
        if (!this.isToken("coroutine")) {
            this.causeSyntaxError("\'coroutine\' not found in coroutine declaration");
        }
        if (!this.isNextToken("identifier")) {
            this.causeSyntaxError("coroutine name not found in coroutine declaration");
        }
        const _loc1_ = String(this.getToken().value);
        const _loc2_ = this.generator.putCoroutine();
        this.beginCoroutine();
        this.generator.beginNewScope();
        if (!this.isNextToken("(")) {
            this.causeSyntaxError("\'(\' not found in coroutine declaration");
        }
        if (this.isNextToken("identifier")) {
            this.parse_formalParameterList();
        }
        if (!this.isToken(")")) {
            this.causeSyntaxError("\')\' not found in coroutine declaration");
        }
        if (!this.isNextToken("{")) {
            this.causeSyntaxError("\'{\' not found in coroutine declaration");
        }
        if (!this.isNextToken("}")) {
            this.parse_functionBody();
        }
        if (!this.hasLastReturn) {
            this.generator.putReturnCoroutine(ExpressionResult.createLiteral(undefined));
        }
        if (!this.isToken("}")) {
            this.causeSyntaxError("\'}\' not found in coroutine declaration");
        }
        this.generator.closeScope();
        this.endCoroutine();
        this.generator.setLabel(_loc2_);
        this.generator.putSetLocalVariable(_loc1_, ExpressionResult.createStack());
        this.generator.popAndDestroyStack();
        this.nextToken();
    }

    private parse_coroutineExpression(param1: ExpressionResult) {
        if (!this.isToken("coroutine")) {
            this.causeSyntaxError("\'coroutine\' not found in coroutine expression");
        }
        let _loc2_;
        if (this.isNextToken("identifier")) {
            _loc2_ = String(this.getToken().value);
            this.nextToken();
        }
        const _loc3_: Label = this.generator.putCoroutine();
        this.beginCoroutine();
        this.generator.beginNewScope();
        if (!this.isToken("(")) {
            this.causeSyntaxError("\'(\' not found in coroutine expression");
        }
        if (this.isNextToken("identifier")) {
            this.parse_formalParameterList();
        }
        if (!this.isToken(")")) {
            this.causeSyntaxError("\')\' not found in coroutine expression");
        }
        if (!this.isNextToken("{")) {
            this.causeSyntaxError("\'{\' not found in coroutine expression");
        }
        if (!this.isNextToken("}")) {
            this.parse_functionBody();
        }
        if (!this.hasLastReturn) {
            this.generator.putReturnCoroutine(ExpressionResult.createLiteral(undefined));
        }
        if (!this.isToken("}")) {
            this.causeSyntaxError("\'}\' not found in coroutine expression");
        }
        this.generator.closeScope();
        this.endCoroutine();
        this.generator.setLabel(_loc3_);
        if (_loc2_ != null) {
            this.generator.putSetLocalVariable(_loc2_, ExpressionResult.createStack());
        }
        param1.setTypeStack();
        this.nextToken();
    }

    private parse_formalParameterList() {
        let _loc1_ = 0;
        while (true) {
            if (!this.isToken("identifier")) {
                this.causeSyntaxError("Parameter name is required");
            }
            this.generator.putArgument(_loc1_, String(this.getToken().value));
            _loc1_++;
            if (!this.isNextToken(",")) {
                break;
            }
            this.nextToken();
        }
    }

    private parse_functionBody() {
        this.parse_sourceElements();
    }

    private parse_statement() {
        this.hasLastReturn = false;
        const _loc1_ = this.generator.getStackLength();
        switch (this.getToken().type) {
            case "{":
                this.parse_block();
                break;
            case "var":
                this.parse_variableStatement();
                break;
            case ";":
                this.parse_emptyStatement();
                break;
            case "if":
                this.parse_ifStatement();
                break;
            case "do":
            case "while":
            case "for":
                this.parse_iterationStatement();
                break;
            case "continue":
                this.parse_continueStatement();
                break;
            case "break":
                this.parse_breakStatement();
                break;
            case "return":
                this.parse_returnStatement();
                break;
            case "with":
                this.parse_withStatement();
                break;
            case "switch":
                this.parse_switchStatement();
                break;
            case "yield":
                this.parse_yieldStatement();
                break;
            case "suspend":
                this.parse_suspendStatement();
                break;
            case "loop":
                this.parse_loopStatement();
                break;
            default:
                if (this.isExpressionFirst(this.getToken().type)) {
                    this.parse_expressionStatement();
                    break;
                }
                this.causeSyntaxError("Unexpected statement token");
            case "function":
                this.causeSyntaxError("Functions are not defined in statements");
        }
        this.generator.cleanUpStack(_loc1_);
    }

    private isStatementFirst(param1: string) {
        return param1 == "{" || param1 == "var" || param1 == ";" || param1 == "if" || param1 == "do" || param1 == "while" || param1 == "for" || param1 == "for" || param1 == "continue" || param1 == "break" || param1 == "return" || param1 == "with" || param1 == "switch" || param1 == "yield" || param1 == "suspend" || param1 == "loop" || param1 != "function" && param1 != "coroutine" && this.isExpressionFirst(param1);
    }

    private parse_block() {
        if (!this.isToken("{")) {
            this.causeSyntaxError("\'{\' not found in block");
        }
        if (!this.isNextToken("}")) {
            this.parse_statementList();
        }
        if (!this.isToken("}")) {
            this.causeSyntaxError("\'}\' not found in block");
        }
        this.nextToken();
    }

    private parse_statementList() {
        this.parse_statement();
        while (!this.isToken("}")) {
            if (!this.isStatementFirst(this.getToken().type)) {
                return;
            }
            this.parse_statement();
        }
    }

    private parse_variableStatement() {
        if (!this.isToken("var")) {
            this.causeSyntaxError("\'var\' not found in variable declaration");
        }
        this.nextToken();
        this.parse_variableDeclarationList();
        if (!this.isToken(";")) {
            this.causeSyntaxError("Variable declaration must end with ;");
        }
        this.nextToken();
    }

    private parse_variableDeclarationList() {
        this.parse_variableDeclaration();
        while (this.isToken(",")) {
            this.nextToken();
            this.parse_variableDeclaration();
        }
    }

    private parse_variableDeclaration() {
        let _loc2_: ExpressionResult;
        if (!this.isToken("identifier")) {
            this.causeSyntaxError("Variable name not found in variable declaration");
        }
        const _loc1_ = String(this.getToken().value);
        if (this.isNextToken("=")) {
            _loc2_ = new ExpressionResult();
            this.parse_initialiser(_loc2_);
            this.generator.putExpressionResult(_loc2_);
            this.generator.putSetLocalVariable(_loc1_, _loc2_);
            this.generator.popAndDestroyStack();
        }
        else {
            this.generator.putSetLocalVariable(_loc1_, ExpressionResult.createLiteral(undefined));
            this.generator.popAndDestroyStack();
        }
    }

    private parse_initialiser(param1: ExpressionResult) {
        if (!this.isToken("=")) {
            this.causeSyntaxError("\'=\' not found in variable initialization");
        }
        this.nextToken();
        this.parse_assignmentExpression(param1);
    }

    private parse_emptyStatement() {
        if (!this.isToken(";")) {
            this.causeSyntaxError("\';\' not found in empty statement");
        }
        this.nextToken();
    }

    private parse_expressionStatement() {
        if (this.isToken("{") || this.isToken("function")) {
            this.causeSyntaxError("Ambiguity found in ExpressionStatement");
        }
        const _loc1_ = new ExpressionResult();
        this.parse_expression(_loc1_);
        this.generator.putExpressionResult(_loc1_);
        if (!this.isToken(";")) {
            this.causeSyntaxError("\';\' not found in expression statement");
        }
        this.nextToken();
    }

    private parse_ifStatement() {
        let _loc3_;
        ++this.lastReturnCaution;
        if (!this.isToken("if")) {
            this.causeSyntaxError("\'if\' not found in if statement");
        }
        if (!this.isNextToken("(")) {
            this.causeSyntaxError("\'(\' not found in if statement");
        }
        this.nextToken();
        const _loc1_ = new ExpressionResult();
        this.parse_expression(_loc1_);
        if (!this.isToken(")")) {
            this.causeSyntaxError("\')\' not found in if statement");
        }
        this.generator.putExpressionResult(_loc1_);
        const _loc2_ = new Label();
        this.generator.putIf(_loc1_, _loc2_);
        this.nextToken();
        this.parse_statement();
        if (this.isToken("else")) {
            _loc3_ = new Label();
            this.generator.putJump(_loc3_);
            this.generator.setLabel(_loc2_);
            this.nextToken();
            this.parse_statement();
            this.generator.setLabel(_loc3_);
        }
        else {
            this.generator.setLabel(_loc2_);
        }
        --this.lastReturnCaution;
    }

    private parse_iterationStatement() {
        ++this.lastReturnCaution;
        if (this.isToken("for")) {
            this.parse_forStatement();
        }
        else if (this.isToken("while")) {
            this.parse_whileStatement();
        }
        else if (this.isToken("do")) {
            this.parse_doStatement();
        }
        else {
            this.causeSyntaxError("unexpected token found in loop statement");
        }
        --this.lastReturnCaution;
    }

    private parse_forStatement() {
        let _loc5_;
        let _loc6_;
        let _loc7_;
        let _loc8_;
        if (!this.isNextToken("(")) {
            this.causeSyntaxError("\'(\' not found in for statement");
        }
        const _loc1_ = new Label();
        const _loc2_ = new Label();
        const _loc3_ = new Label();
        const _loc4_ = new Label();
        this.pushBreakLabel(_loc4_);
        this.pushContinueLabel(_loc2_);
        if (this.isNextToken("var")) {
            this.nextToken();
            this.parse_variableDeclaration();
        }
        else if (!this.isToken(";")) {
            _loc5_ = this.generator.getStackLength();
            _loc6_ = new ExpressionResult();
            this.parse_expression(_loc6_);
            this.generator.putExpressionResult(_loc6_);
            this.generator.cleanUpStack(_loc5_);
        }
        if (!this.isToken(";")) {
            this.causeSyntaxError("\';\' not found in for statement");
        }
        this.generator.setLabel(_loc1_);
        if (!this.isNextToken(";")) {
            _loc5_ = this.generator.getStackLength();
            _loc7_ = new ExpressionResult();
            this.parse_expression(_loc7_);
            this.generator.putExpressionResult(_loc7_);
            this.generator.putIf(_loc7_, _loc4_);
            this.generator.cleanUpStack(_loc5_);
        }
        if (!this.isToken(";")) {
            this.causeSyntaxError("\';\' not found in for statement");
        }
        this.generator.putJump(_loc3_);
        this.generator.setLabel(_loc2_);
        if (!this.isNextToken(")")) {
            _loc5_ = this.generator.getStackLength();
            _loc8_ = new ExpressionResult();
            this.parse_expression(_loc8_);
            this.generator.putExpressionResult(_loc8_);
            this.generator.cleanUpStack(_loc5_);
        }
        this.generator.putJump(_loc1_);
        if (!this.isToken(")")) {
            this.causeSyntaxError("\')\' not found in for statement");
        }
        this.nextToken();
        this.generator.setLabel(_loc3_);
        this.parse_statement();
        this.generator.putJump(_loc2_);
        this.generator.setLabel(_loc4_);
        this.popContinueLabel();
        this.popBreakLabel();
    }

    private parse_whileStatement() {
        if (!this.isNextToken("(")) {
            this.causeSyntaxError("\'(\' not found in while statement");
        }
        this.nextToken();
        const _loc1_ = new Label();
        const _loc2_ = new Label();
        this.pushBreakLabel(_loc2_);
        this.pushContinueLabel(_loc1_);
        this.generator.setLabel(_loc1_);
        const _loc3_ = new ExpressionResult();
        this.parse_expression(_loc3_);
        this.generator.putExpressionResult(_loc3_);
        this.generator.putIf(_loc3_, _loc2_);
        if (!this.isToken(")")) {
            this.causeSyntaxError("\')\' not found in while statement");
        }
        this.nextToken();
        this.parse_statement();
        this.generator.putJump(_loc1_);
        this.generator.setLabel(_loc2_);
        this.popContinueLabel();
        this.popBreakLabel();
    }

    private parse_doStatement() {
        this.nextToken();
        const _loc1_ = new Label();
        const _loc2_ = new Label();
        const _loc3_ = new Label();
        this.pushBreakLabel(_loc3_);
        this.pushContinueLabel(_loc2_);
        this.generator.setLabel(_loc1_);
        this.parse_statement();
        if (!this.isToken("while")) {
            this.causeSyntaxError("\'while\' not found in do statement");
        }
        if (!this.isNextToken("(")) {
            this.causeSyntaxError("\'(\' not found in do-while statement");
        }
        this.nextToken();
        this.generator.setLabel(_loc2_);
        const _loc4_ = new ExpressionResult();
        this.parse_expression(_loc4_);
        this.generator.putExpressionResult(_loc4_);
        this.generator.putIf(_loc4_, _loc3_);
        this.generator.putJump(_loc1_);
        if (!this.isToken(")")) {
            this.causeSyntaxError("\')\' not found in do-while statement");
        }
        this.generator.setLabel(_loc3_);
        this.popContinueLabel();
        this.popBreakLabel();
        this.nextToken();
    }

    private parse_continueStatement() {
        if (!this.isToken("continue")) {
            this.causeSyntaxError("\'continue\' not found in continue statement");
        }
        if (!this.isNextToken(";")) {
            this.causeSyntaxError("\';\' not found in continue statement");
        }
        this.generator.putJump(this.getContinueLabel());
        this.nextToken();
    }

    private parse_breakStatement() {
        if (!this.isToken("break")) {
            this.causeSyntaxError("\'break\' not found in break statement");
        }
        if (!this.isNextToken(";")) {
            this.causeSyntaxError("\';\' not found in break statement");
        }
        this.generator.putJump(this.getBreakLabel());
        this.nextToken();
    }

    private parse_returnStatement() {
        let _loc1_;
        if (!this.isToken("return")) {
            this.causeSyntaxError("\'return\' not found in return statement");
        }
        if (!this.isAllowReturn()) {
            this.causeSyntaxError("return is only used in functions or coroutines");
        }
        if (!this.lastReturnCaution) { // 错误比较？
            this.hasLastReturn = true;
        }
        if (this.isExpressionFirst(this.nextToken().type)) {
            _loc1_ = new ExpressionResult();
            this.parse_expression(_loc1_);
            this.generator.putExpressionResult(_loc1_);
        }
        else {
            _loc1_ = ExpressionResult.createLiteral(undefined);
        }
        if (this.isInFunction()) {
            this.generator.putReturnFunction(_loc1_);
        }
        else {
            this.generator.putReturnCoroutine(_loc1_);
        }
        if (!this.isToken(";")) {
            this.causeSyntaxError("\';\' not found in return statement");
        }
        this.nextToken();
    }

    private parse_withStatement() {
        if (!this.isToken("with")) {
            this.causeSyntaxError("\'with\' not found in with statement");
        }
        if (!this.isNextToken("(")) {
            this.causeSyntaxError("\'(\' not found in with statement");
        }
        throw new Error("不能使用 with!");
    }

    private parse_switchStatement() {
        if (!this.isToken("switch")) {
            this.causeSyntaxError("\'switch\' not found in switch statement");
        }
        if (!this.isNextToken("(")) {
            this.causeSyntaxError("\'(\' not found in switch statement");
        }
        this.nextToken();
        const _loc1_ = new ExpressionResult();
        this.parse_expression(_loc1_);
        this.generator.putExpressionResult(_loc1_);
        if (!this.isToken(")")) {
            this.causeSyntaxError("\')\' not found in switch statement");
        }
        const _loc2_ = new Label();
        this.pushBreakLabel(_loc2_);
        this.nextToken();
        this.parse_caseBlock(_loc1_);
        this.generator.setLabel(_loc2_);
        this.popBreakLabel();
    }

    private parse_caseBlock(param1: ExpressionResult) {
        let _loc4_;
        if (!this.isToken("{")) {
            this.causeSyntaxError("\'{\' not found in switch-case statement");
        }
        const _loc2_ = new Label();
        const _loc3_ = new Label();
        if (this.isNextToken("case")) {
            this.parse_caseClauses(param1, _loc2_, _loc3_);
        }
        if (this.isToken("default")) {
            _loc4_ = new Label();
            this.generator.setLabel(_loc4_);
            this.parse_defaultClause(_loc3_);
            if (this.isToken("case")) {
                this.parse_caseClauses(param1, _loc2_, _loc3_);
            }
            this.generator.setLabelAddress(_loc2_, _loc4_.address);
            this.generator.setLabel(_loc3_);
        }
        else {
            this.generator.setLabel(_loc2_);
            this.generator.setLabel(_loc3_);
        }
        if (!this.isToken("}")) {
            this.causeSyntaxError("\'}\' not found in switch-case statement");
        }
        this.nextToken();
    }

    private parse_caseClauses(param1: ExpressionResult, param2: Label, param3: Label) {
        while (this.isToken("case")) {
            this.parse_caseClause(param1, param2, param3);
        }
    }

    private parse_caseClause(param1: ExpressionResult, param2: Label, param3: Label) {
        if (!this.isToken("case")) {
            this.causeSyntaxError("\'case\' not found in case statement");
        }
        this.generator.setLabel(param2);
        param2.initialize();
        if (!param1.isLiteral()) {
            this.generator.putDuplicate(param1);
        }
        this.nextToken();
        const _loc4_ = new ExpressionResult();
        this.parse_expression(_loc4_);
        this.generator.putExpressionResult(_loc4_);
        this.generator.putBinaryOperation(this.vmtarget == null ? "CSEQ" : this.vmtarget.CSEQ, param1, _loc4_);
        this.generator.putIf(ExpressionResult.createStack(), param2);
        if (!this.isToken(":")) {
            this.causeSyntaxError("\':\' not found in case statement");
        }
        this.generator.setLabel(param3);
        param3.initialize();
        if (this.isStatementFirst(this.nextToken().type)) {
            this.parse_statementList();
        }
        this.generator.putJump(param3);
    }

    private parse_defaultClause(param1: Label) {
        if (!this.isToken("default")) {
            this.causeSyntaxError("\'default\' not found in default statement");
        }
        if (!this.isNextToken(":")) {
            this.causeSyntaxError("\':\' not found in default statement");
        }
        this.generator.setLabel(param1);
        param1.initialize();
        if (this.isStatementFirst(this.nextToken().type)) {
            this.parse_statementList();
        }
        this.generator.putJump(param1);
    }

    private parse_yieldStatement() {
        if (!this.isToken("yield")) {
            this.causeSyntaxError("\'yield\' not found in yield statement");
        }
        if (!this.isNextToken(";")) {
            this.causeSyntaxError("\';\' not found in yield statement");
        }
        if (this.isInFunction()) {
            this.causeSyntaxError("yield statement can only be used in a coroutine");
        }
        this.generator.putSuspend();
        this.nextToken();
    }

    private parse_suspendStatement() {
        if (!this.isToken("suspend")) {
            this.causeSyntaxError("\'suspend\' not found in suspend statement");
        }
        if (!this.isNextToken(";")) {
            this.causeSyntaxError("\';\' not found in suspend statement");
        }
        if (this.isInFunction()) {
            this.causeSyntaxError("suspend statement can only be used in a coroutine");
        }
        this.generator.putSuspend();
        this.nextToken();
    }

    private parse_loopStatement() {
        if (!this.isToken("loop")) {
            this.causeSyntaxError("\'loop\' not found in loop statement");
        }
        this.nextToken();
        const _loc1_ = new Label();
        const _loc2_ = new Label();
        this.pushBreakLabel(_loc2_);
        this.pushContinueLabel(_loc1_);
        this.generator.setLabel(_loc1_);
        this.parse_statement();
        this.generator.putJump(_loc1_);
        this.generator.setLabel(_loc2_);
        this.popContinueLabel();
        this.popBreakLabel();
    }

    private parse_expression(param1: ExpressionResult) {
        this.parse_assignmentExpression(param1);
        while (this.isToken(",")) {
            this.nextToken();
            this.generator.putExpressionResult(param1);
            this.generator.popAndDestroyStack();
            param1.initialize();
            this.parse_assignmentExpression(param1);
        }
    }

    private isExpressionFirst(param1: String) {
        return this.isUnaryExpressionFirst(param1);
    }

    private areBothLiteral(param1: ExpressionResult, param2: ExpressionResult) {
        return param1.isType("literal") && param2.isType("literal");
    }

    private parse_assignmentExpression(param1: ExpressionResult) {
        let _loc2_;
        let _loc3_;
        let _loc4_;
        let _loc5_;
        let _loc6_;
        let _loc7_;
        this.parse_conditionalExpression(param1);
        switch (this.getToken().type) {
            case "=":
                this.nextToken();
                switch (param1.type) {
                    case "member":
                        _loc3_ = param1.getObjectExpression();
                        _loc4_ = param1.getMemberExpression();
                        this.generator.putExpressionResult(_loc4_);
                        _loc2_ = new ExpressionResult();
                        this.parse_assignmentExpression(_loc2_);
                        this.generator.putExpressionResult(_loc2_);
                        this.generator.putSetMember(_loc3_, _loc4_, _loc2_);
                        break;
                    case "variable":
                        _loc2_ = new ExpressionResult();
                        this.parse_assignmentExpression(_loc2_);
                        this.generator.putExpressionResult(_loc2_);
                        this.generator.putSetVariable(String(param1.value), _loc2_);
                        break;
                    default:
                        this.causeSyntaxError("L-value must be a variable or property");
                }
                param1.setTypeStack();
                break;
            case "*=":
            case "/=":
            case "%=":
            case "+=":
            case "-=":
            case "<<=":
            case ">>=":
            case ">>>=":
            case "&=":
            case "^=":
            case "|=":
                switch (this.getToken().type) {
                    case "*=":
                        _loc5_ = this.vmtarget == null ? "MUL" : this.vmtarget.MUL;
                        break;
                    case "/=":
                        _loc5_ = this.vmtarget == null ? "DIV" : this.vmtarget.DIV;
                        break;
                    case "%=":
                        _loc5_ = this.vmtarget == null ? "MOD" : this.vmtarget.MOD;
                        break;
                    case "+=":
                        _loc5_ = this.vmtarget == null ? "ADD" : this.vmtarget.ADD;
                        break;
                    case "-=":
                        _loc5_ = this.vmtarget == null ? "SUB" : this.vmtarget.SUB;
                        break;
                    case "<<=":
                        _loc5_ = this.vmtarget == null ? "LSH" : this.vmtarget.LSH;
                        break;
                    case ">>=":
                        _loc5_ = this.vmtarget == null ? "RSH" : this.vmtarget.RSH;
                        break;
                    case ">>>=":
                        _loc5_ = this.vmtarget == null ? "URSH" : this.vmtarget.URSH;
                        break;
                    case "&=":
                        _loc5_ = this.vmtarget == null ? "AND" : this.vmtarget.AND;
                        break;
                    case "^=":
                        _loc5_ = this.vmtarget == null ? "XOR" : this.vmtarget.XOR;
                        break;
                    case "|=":
                        _loc5_ = this.vmtarget == null ? "OR" : this.vmtarget.OR;
                }
                this.nextToken();
                switch (param1.type) {
                    case "member":
                        _loc3_ = param1.getObjectExpression();
                        if (!(_loc4_ = param1.getMemberExpression()).isLiteral()) {
                            this.generator.putExpressionResult(_loc4_);
                            _loc6_ = this.generator.popStack();
                            this.generator.putDuplicate(_loc4_);
                            this.generator.pushStack(_loc6_);
                            this.generator.putDuplicate(_loc3_);
                            this.generator.swapStack(1, 2);
                        }
                        else {
                            this.generator.putDuplicate(_loc3_);
                        }
                        this.generator.putGetMember(_loc3_, _loc4_);
                        param1.setTypeStack();
                        _loc2_ = new ExpressionResult();
                        this.parse_assignmentExpression(_loc2_);
                        this.generator.putExpressionResult(_loc2_);
                        this.generator.putBinaryOperation(_loc5_, param1, _loc2_);
                        this.generator.putSetMember(_loc3_, _loc4_, param1);
                        break;
                    case "variable":
                        _loc7_ = String(param1.value);
                        this.generator.putGetVariable(_loc7_);
                        param1.setTypeStack();
                        _loc2_ = new ExpressionResult();
                        this.parse_assignmentExpression(_loc2_);
                        this.generator.putExpressionResult(_loc2_);
                        this.generator.putBinaryOperation(_loc5_, param1, _loc2_);
                        this.generator.putSetVariable(_loc7_, param1);
                        break;
                    default:
                        this.causeSyntaxError("L-value must be a variable or property");
                }
                param1.setTypeStack();
        }
    }

    private parse_conditionalExpression(param1: ExpressionResult) {
        let _loc2_;
        let _loc3_;
        let _loc4_;
        this.parse_logicalORExpression(param1);
        if (this.isToken("?")) {
            this.generator.putExpressionResult(param1);
            _loc2_ = new Label();
            this.generator.putIf(param1, _loc2_);
            this.nextToken();
            param1.initialize();
            this.parse_assignmentExpression(param1);
            if (param1.isType("literal")) {
                this.generator.putLiteral(param1);
            }
            else {
                this.generator.putExpressionResult(param1);
            }
            _loc3_ = this.generator.popStack();
            _loc4_ = new Label();
            this.generator.putJump(_loc4_);
            this.generator.setLabel(_loc2_);
            if (!this.isToken(":")) {
                this.causeSyntaxError("\':\' not found in ?: statement");
            }
            this.nextToken();
            param1.initialize();
            this.parse_assignmentExpression(param1);
            if (param1.isType("literal")) {
                this.generator.putLiteral(param1);
            }
            else {
                this.generator.putExpressionResult(param1);
            }
            param1.setType("stack");
            this.generator.setStackPatch(_loc3_);
            this.generator.setLabel(_loc4_);
        }
    }

    private parse_logicalORExpression(param1: ExpressionResult) {
        let _loc2_;
        let _loc3_;
        this.parse_logicalANDExpression(param1);
        while (this.isToken("||")) {
            this.nextToken();
            this.generator.putExpressionResult(param1);
            this.generator.putDuplicate(param1);
            _loc2_ = this.generator.popStack();
            param1.setType("stack");
            _loc3_ = new Label();
            this.generator.putNif(param1, _loc3_);
            param1.initialize();
            this.parse_logicalANDExpression(param1);
            if (param1.isType("literal")) {
                this.generator.putLiteral(param1);
            }
            else {
                this.generator.putExpressionResult(param1);
            }
            this.generator.setStackPatch(_loc2_);
            param1.setType("stack");
            this.generator.setLabel(_loc3_);
        }
    }

    private parse_logicalANDExpression(param1: ExpressionResult) {
        let _loc2_;
        let _loc3_;
        this.parse_bitwiseORExpression(param1);
        while (this.isToken("&&")) {
            this.nextToken();
            this.generator.putExpressionResult(param1);
            this.generator.putDuplicate(param1);
            _loc2_ = this.generator.popStack();
            param1.setType("stack");
            _loc3_ = new Label();
            this.generator.putIf(param1, _loc3_);
            param1.initialize();
            this.parse_bitwiseORExpression(param1);
            if (param1.isType("literal")) {
                this.generator.putLiteral(param1);
            }
            else {
                this.generator.putExpressionResult(param1);
            }
            this.generator.setStackPatch(_loc2_);
            param1.setType("stack");
            this.generator.setLabel(_loc3_);
        }
    }

    private parse_bitwiseORExpression(param1: ExpressionResult) {
        let _loc2_;
        let _loc3_;
        this.parse_bitwiseXORExpression(param1);
        while (this.isToken("|")) {
            _loc2_ = this.getToken().type;
            this.nextToken();
            this.generator.putExpressionResult(param1);
            _loc3_ = new ExpressionResult();
            this.parse_bitwiseXORExpression(_loc3_);
            this.generator.putExpressionResult(_loc3_);
            if (this.areBothLiteral(param1, _loc3_)) {
                param1.setValue(param1.value | _loc3_.value);
            }
            else {
                this.generator.putBinaryOperation(this.vmtarget == null ? "OR" : this.vmtarget.OR, param1, _loc3_);
                param1.setType("stack");
            }
        }
    }

    private parse_bitwiseXORExpression(param1: ExpressionResult) {
        let _loc2_;
        let _loc3_;
        this.parse_bitwiseANDExpression(param1);
        while (this.isToken("^")) {
            _loc2_ = this.getToken().type;
            this.nextToken();
            this.generator.putExpressionResult(param1);
            _loc3_ = new ExpressionResult();
            this.parse_bitwiseANDExpression(_loc3_);
            this.generator.putExpressionResult(_loc3_);
            if (this.areBothLiteral(param1, _loc3_)) {
                param1.setValue(param1.value ^ _loc3_.value);
            }
            else {
                this.generator.putBinaryOperation(this.vmtarget == null ? "XOR" : this.vmtarget.XOR, param1, _loc3_);
                param1.setType("stack");
            }
        }
    }

    private parse_bitwiseANDExpression(param1: ExpressionResult) {
        let _loc2_;
        let _loc3_;
        this.parse_equalityExpression(param1);
        while (this.isToken("&")) {
            _loc2_ = this.getToken().type;
            this.nextToken();
            this.generator.putExpressionResult(param1);
            _loc3_ = new ExpressionResult();
            this.parse_equalityExpression(_loc3_);
            this.generator.putExpressionResult(_loc3_);
            if (this.areBothLiteral(param1, _loc3_)) {
                param1.setValue(param1.value & _loc3_.value);
            }
            else {
                this.generator.putBinaryOperation(this.vmtarget == null ? "AND" : this.vmtarget.AND, param1, _loc3_);
                param1.setType("stack");
            }
        }
    }

    private parse_equalityExpression(param1: ExpressionResult) {
        let _loc2_;
        let _loc3_;
        this.parse_relationalExpression(param1);
        while (this.isToken("==") || this.isToken("!=") || this.isToken("===") || this.isToken("!==")) {
            _loc2_ = this.getToken().type;
            this.nextToken();
            this.generator.putExpressionResult(param1);
            _loc3_ = new ExpressionResult();
            this.parse_relationalExpression(_loc3_);
            this.generator.putExpressionResult(_loc3_);
            if (this.areBothLiteral(param1, _loc3_)) {
                switch (_loc2_) {
                    case "==":
                        param1.setValue(param1.value == _loc3_.value);
                        break;
                    case "!=":
                        param1.setValue(param1.value != _loc3_.value);
                        break;
                    case "===":
                        param1.setValue(param1.value === _loc3_.value);
                        break;
                    case "!==":
                        param1.setValue(param1.value !== _loc3_.value);
                }
            }
            else {
                switch (_loc2_) {
                    case "==":
                        this.generator.putBinaryOperation(this.vmtarget == null ? "CEQ" : this.vmtarget.CEQ, param1, _loc3_);
                        break;
                    case "!=":
                        this.generator.putBinaryOperation(this.vmtarget == null ? "CNE" : this.vmtarget.CNE, param1, _loc3_);
                        break;
                    case "===":
                        this.generator.putBinaryOperation(this.vmtarget == null ? "CSEQ" : this.vmtarget.CSEQ, param1, _loc3_);
                        break;
                    case "!==":
                        this.generator.putBinaryOperation(this.vmtarget == null ? "CSNE" : this.vmtarget.CSNE, param1, _loc3_);
                }
                param1.setType("stack");
            }
        }
    }

    private parse_relationalExpression(param1: ExpressionResult) {
        let _loc2_;
        let _loc3_;
        this.parse_shiftExpression(param1);
        while (this.isToken("<") || this.isToken(">") || this.isToken("<=") || this.isToken(">=") || this.isToken("instanceof")) {
            _loc2_ = this.getToken().type;
            this.nextToken();
            this.generator.putExpressionResult(param1);
            _loc3_ = new ExpressionResult();
            this.parse_shiftExpression(_loc3_);
            this.generator.putExpressionResult(_loc3_);
            if (this.areBothLiteral(param1, _loc3_)) {
                switch (_loc2_) {
                    case "<":
                        param1.setValue(param1.value < _loc3_.value);
                        break;
                    case ">":
                        param1.setValue(param1.value > _loc3_.value);
                        break;
                    case "<=":
                        param1.setValue(param1.value <= _loc3_.value);
                        break;
                    case ">=":
                        param1.setValue(param1.value >= _loc3_.value);
                        break;
                    case "instanceof":
                        param1.setValue(param1.value instanceof _loc3_.value);
                }
            }
            else {
                switch (_loc2_) {
                    case "<":
                        this.generator.putBinaryOperation(this.vmtarget == null ? "CLT" : this.vmtarget.CLT, param1, _loc3_);
                        break;
                    case ">":
                        this.generator.putBinaryOperation(this.vmtarget == null ? "CGT" : this.vmtarget.CGT, param1, _loc3_);
                        break;
                    case "<=":
                        this.generator.putBinaryOperation(this.vmtarget == null ? "CLE" : this.vmtarget.CLE, param1, _loc3_);
                        break;
                    case ">=":
                        this.generator.putBinaryOperation(this.vmtarget == null ? "CGE" : this.vmtarget.CGE, param1, _loc3_);
                        break;
                    case "instanceof":
                        this.generator.putBinaryOperation(this.vmtarget == null ? "INSOF" : this.vmtarget.INSOF, param1, _loc3_);
                }
                param1.setType("stack");
            }
        }
    }

    private parse_shiftExpression(param1: ExpressionResult) {
        let _loc2_;
        let _loc3_;
        this.parse_additiveExpression(param1);
        while (this.isToken("<<") || this.isToken(">>") || this.isToken(">>>")) {
            _loc2_ = this.getToken().type;
            this.nextToken();
            this.generator.putExpressionResult(param1);
            _loc3_ = new ExpressionResult();
            this.parse_additiveExpression(_loc3_);
            this.generator.putExpressionResult(_loc3_);
            if (this.areBothLiteral(param1, _loc3_)) {
                switch (_loc2_) {
                    case "<<":
                        param1.setValue(param1.value << _loc3_.value);
                        break;
                    case ">>":
                        param1.setValue(param1.value >> _loc3_.value);
                        break;
                    case ">>>":
                        param1.setValue(param1.value >>> _loc3_.value);
                }
            }
            else {
                switch (_loc2_) {
                    case "<<":
                        this.generator.putBinaryOperation(this.vmtarget == null ? "LSH" : this.vmtarget.LSH, param1, _loc3_);
                        break;
                    case ">>":
                        this.generator.putBinaryOperation(this.vmtarget == null ? "RSH" : this.vmtarget.RSH, param1, _loc3_);
                        break;
                    case ">>>":
                        this.generator.putBinaryOperation(this.vmtarget == null ? "URSH" : this.vmtarget.URSH, param1, _loc3_);
                }
                param1.setType("stack");
            }
        }
    }

    private parse_additiveExpression(param1: ExpressionResult) {
        let _loc2_;
        let _loc3_;
        this.parse_multiplicativeExpression(param1);
        while (this.isToken("+") || this.isToken("-")) {
            _loc2_ = this.getToken().type;
            this.nextToken();
            this.generator.putExpressionResult(param1);
            _loc3_ = new ExpressionResult();
            this.parse_multiplicativeExpression(_loc3_);
            this.generator.putExpressionResult(_loc3_);
            if (this.areBothLiteral(param1, _loc3_)) {
                switch (_loc2_) {
                    case "+":
                        param1.setValue(param1.value + _loc3_.value);
                        break;
                    case "-":
                        param1.setValue(param1.value - _loc3_.value);
                }
            }
            else {
                switch (_loc2_) {
                    case "+":
                        this.generator.putBinaryOperation(this.vmtarget == null ? "ADD" : this.vmtarget.ADD, param1, _loc3_);
                        break;
                    case "-":
                        this.generator.putBinaryOperation(this.vmtarget == null ? "SUB" : this.vmtarget.SUB, param1, _loc3_);
                }
                param1.setType("stack");
            }
        }
    }

    private parse_multiplicativeExpression(param1: ExpressionResult) {
        let _loc2_;
        let _loc3_;
        this.parse_unaryExpression(param1);
        while (this.isToken("*") || this.isToken("/") || this.isToken("%")) {
            _loc2_ = this.getToken().type;
            this.nextToken();
            this.generator.putExpressionResult(param1);
            _loc3_ = new ExpressionResult();
            this.parse_unaryExpression(_loc3_);
            this.generator.putExpressionResult(_loc3_);
            if (this.areBothLiteral(param1, _loc3_)) {
                switch (_loc2_) {
                    case "*":
                        param1.setValue(param1.value * _loc3_.value);
                        break;
                    case "/":
                        param1.setValue(param1.value / _loc3_.value);
                        break;
                    case "%":
                        param1.setValue(param1.value % _loc3_.value);
                }
            }
            else {
                switch (_loc2_) {
                    case "*":
                        this.generator.putBinaryOperation(this.vmtarget == null ? "MUL" : this.vmtarget.MUL, param1, _loc3_);
                        break;
                    case "/":
                        this.generator.putBinaryOperation(this.vmtarget == null ? "DIV" : this.vmtarget.DIV, param1, _loc3_);
                        break;
                    case "%":
                        this.generator.putBinaryOperation(this.vmtarget == null ? "MOD" : this.vmtarget.MOD, param1, _loc3_);
                }
                param1.setType("stack");
            }
        }
    }

    private parse_unaryExpression(param1: ExpressionResult) {
        let _loc2_;
        let _loc3_;
        let _loc4_;
        switch (this.getToken().type) {
            case "delete":
                this.nextToken();
                this.parse_unaryExpression(param1);
                switch (param1.type) {
                    case "member":
                        _loc2_ = param1.getObjectExpression();
                        _loc3_ = param1.getMemberExpression();
                        this.generator.putExpressionResult(_loc3_);
                        this.generator.putDeleteMember(_loc2_, _loc3_);
                        break;
                    case "variable":
                        this.generator.putDelete(param1);
                        break;
                    default:
                        this.generator.putExpressionResult(param1);
                        this.generator.putDelete(param1);
                }
                param1.setTypeStack();
                break;
            case "void":
                this.nextToken();
                this.parse_unaryExpression(param1);
                break;
            case "typeof":
                this.nextToken();
                this.parse_unaryExpression(param1);
                this.generator.putExpressionResult(param1);
                if (param1.isType("literal")) {
                    param1.setValue(typeof param1.value);
                }
                else {
                    this.generator.putUnaryOperation(this.vmtarget == null ? "TYPEOF" : this.vmtarget.TYPEOF, param1);
                    param1.setTypeStack();
                }
                break;
            case "++":
                this.nextToken();
                this.parse_unaryExpression(param1);
                this.generator.putIncrement(param1);
                param1.setTypeStack();
                break;
            case "--":
                this.nextToken();
                this.parse_unaryExpression(param1);
                this.generator.putDecrement(param1);
                param1.setTypeStack();
                break;
            case "+":
                this.nextToken();
                this.parse_unaryExpression(param1);
                break;
            case "-":
                this.nextToken();
                this.parse_unaryExpression(param1);
                this.generator.putExpressionResult(param1);
                if (param1.isType("literal")) {
                    param1.setValue(-param1.value);
                }
                else {
                    (_loc4_ = new ExpressionResult()).setTypeAndValue("literal", 0);
                    this.generator.putBinaryOperation(this.vmtarget == null ? "SUB" : this.vmtarget.SUB, _loc4_, param1);
                    param1.setType("stack");
                }
                break;
            case "~":
                this.nextToken();
                this.parse_unaryExpression(param1);
                this.generator.putExpressionResult(param1);
                if (param1.isType("literal")) {
                    param1.setValue(~param1.value);
                }
                else {
                    this.generator.putUnaryOperation(this.vmtarget == null ? "NOT" : this.vmtarget.NOT, param1);
                    param1.setType("stack");
                }
                break;
            case "!":
                this.nextToken();
                this.parse_unaryExpression(param1);
                this.generator.putExpressionResult(param1);
                if (param1.isType("literal")) {
                    param1.setValue(!param1.value);
                }
                else {
                    this.generator.putUnaryOperation(this.vmtarget == null ? "LNOT" : this.vmtarget.LNOT, param1);
                    param1.setType("stack");
                }
                break;
            default:
                this.parse_postfixExpression(param1);
        }
    }

    private isUnaryExpressionFirst(param1: String) {
        return param1 == "delete" || param1 == "void" || param1 == "typeof" || param1 == "++" || param1 == "--" || param1 == "+" || param1 == "-" || param1 == "~" || param1 == "!" || this.isMemberExpressionFirst(param1);
    }

    private parse_postfixExpression(param1: ExpressionResult) {
        this.parse_leftHandSideExpression(param1);
        if (this.isToken("++") || this.isToken("--")) {
            switch (this.getToken().type) {
                case "++":
                    this.generator.putPostfixIncrement(param1);
                    break;
                case "--":
                    this.generator.putPostfixDecrement(param1);
            }
            param1.setTypeStack();
            this.nextToken();
        }
    }

    private parse_leftHandSideExpression(param1: ExpressionResult) {
        this.parse_callExpression(param1);
    }

    private parse_callExpression(param1: ExpressionResult) {
        let _loc2_;
        let _loc3_;
        let _loc4_;
        this.parse_memberExpression(param1);
        while (this.isToken("(")) {
            _loc2_ = this.parse_arguments();
            switch (param1.type) {
                case "member":
                    _loc3_ = param1.getObjectExpression();
                    _loc4_ = param1.getMemberExpression();
                    this.generator.putExpressionResult(_loc4_);
                    this.generator.putCallMember(_loc3_, _loc4_, _loc2_);
                    break;
                case "stack":
                    this.generator.putCallFunctor(_loc2_);
                    break;
                default:
                    this.generator.putCall(param1, _loc2_);
                    break;
            }
            param1.setType("stack");
        }
    }

    private parse_memberExpression(param1: ExpressionResult) {
        let _loc2_;
        let _loc3_;
        switch (this.getToken().type) {
            case "function":
                if (this.parseForceCoroutine == false) {
                    this.parse_functionExpression(param1);
                }
                else {
                    this.token.type = "coroutine";
                    this.parse_coroutineExpression(param1);
                }
                break;
            case "coroutine":
                this.parse_coroutineExpression(param1);
                break;
            case "new":
                this.nextToken();
                this.parse_memberExpression(param1);
                this.generator.putExpressionResult(param1);
                _loc2_ = 0;
                if (this.isToken("(")) {
                    _loc2_ += this.parse_arguments();
                }
                this.generator.putNew(_loc2_);
                param1.setType("stack");
                break;
            default:
                this.parse_primaryExpression(param1);
        }
        while (true) {
            if (this.isToken("[")) {
                this.nextToken();
                this.generator.putExpressionResult(param1);
                _loc3_ = new ExpressionResult();
                this.parse_expression(_loc3_);
                param1.setTypeMember(param1.clone(), _loc3_);
                if (!this.isToken("]")) {
                    this.causeSyntaxError("\']\' not found in array access");
                }
                this.nextToken();
            }
            else {
                if (!this.isToken(".")) {
                    break;
                }
                this.generator.putExpressionResult(param1);
                if (!this.isNextToken("identifier")) {
                    this.causeSyntaxError("\'.\' not found in property access");
                }
                param1.setTypeMember(param1.clone(), ExpressionResult.createLiteral(this.getToken().value));
                this.nextToken();
            }
        }
    }

    private isMemberExpressionFirst(param1: String) {
        return param1 == "new" || param1 == "function" || this.isPrimaryExpressionFirst(param1);
    }

    private parse_arguments() {
        if (!this.isToken("(")) {
            this.causeSyntaxError("\'(\' not found in argument list");
        }
        let _loc1_ = 0;
        if (!this.isNextToken(")")) {
            _loc1_ += this.parse_argumentList();
        }
        if (!this.isToken(")")) {
            this.causeSyntaxError("\')\' not found in argument list");
        }
        this.nextToken();
        return _loc1_;
    }

    private parse_argumentList() {
        let _loc2_;
        let _loc1_ = 0;
        while (true) {
            _loc2_ = new ExpressionResult();
            this.parse_assignmentExpression(_loc2_);
            this.generator.putExpressionResult(_loc2_);
            this.generator.putPush(_loc2_);
            _loc1_++;
            if (!this.isToken(",")) {
                break;
            }
            this.nextToken();
        }
        return _loc1_;
    }

    private parse_primaryExpression(param1: ExpressionResult) {
        let _loc2_;
        let _loc3_;
        switch (this.getToken().type) {
            case "this":
                this.generator.putThis();
                param1.setType("stack");
                this.nextToken();
                break;
            case "identifier":
                param1.setTypeAndValue("variable", this.getToken().value);
                this.nextToken();
                break;
            case "string":
            case "number":
            case "bool":
            case "null":
            case "undefined":
                param1.setTypeAndValue("literal", this.getToken().value);
                this.nextToken();
                break;
            case "[":
                _loc2_ = this.parse_arrayLiteral();
                this.generator.putArrayLiteral(_loc2_);
                param1.setType("stack");
                break;
            case "{":
                _loc3_ = this.parse_objectLiteral();
                this.generator.putObjectLiteral(_loc3_);
                param1.setType("stack");
                break;
            case "(":
                this.nextToken();
                this.parse_expression(param1);
                if (!this.isToken(")")) {
                    this.causeSyntaxError("matching \')\' not found in expression");
                }
                this.nextToken();
                break;
            default:
                this.causeSyntaxError("unexpected token");
        }
    }

    private isPrimaryExpressionFirst(param1: String) {
        return param1 == "this" || param1 == "identifier" || param1 == "string" || param1 == "number" || param1 == "bool" || param1 == "undefined" || param1 == "null" || param1 == "{" || param1 == "[" || param1 == "(";
    }

    private parse_arrayLiteral() {
        if (!this.isToken("[")) {
            this.causeSyntaxError("\'[\' not found in array initializer");
        }
        let _loc1_ = 0;
        if (!this.isNextToken("]")) {
            if (this.isToken(",")) {
                _loc1_ += this.parse_elision();
            }
            if (!this.isToken("]")) {
                _loc1_ += this.parse_elementList();
            }
            if (this.isToken(",")) {
                _loc1_ += this.parse_elision();
            }
        }
        if (!this.isToken("]")) {
            this.causeSyntaxError("\']\' not found in array initializer");
        }
        this.nextToken();
        return _loc1_;
    }

    private parse_elision() {
        if (!this.isToken(",")) {
            this.causeSyntaxError("\',\' not found in elision");
        }
        let _loc1_ = 1;
        const _loc2_ = ExpressionResult.createLiteral(undefined);
        do {
            this.generator.putPush(_loc2_);
            _loc1_++;
        }
        while (this.isNextToken(","));

        if (this.isToken("]")) {
            this.generator.putPush(_loc2_);
            _loc1_++;
        }
        return _loc1_;
    }

    private parse_elementList() {
        let _loc2_;
        let _loc1_ = 0;
        while (true) {
            if (this.isToken(",")) {
                _loc1_ += this.parse_elision();
            }
            else {
                if (this.isToken("]")) {
                    break;
                }
                _loc2_ = new ExpressionResult();
                this.parse_assignmentExpression(_loc2_);
                this.generator.putExpressionResult(_loc2_);
                this.generator.putPush(_loc2_);
                _loc1_++;
                if (!this.isToken(",")) {
                    break;
                }
                this.nextToken();
            }
        }
        return _loc1_;
    }

    private parse_objectLiteral() {
        if (!this.isToken("{")) {
            this.causeSyntaxError("\'{\' not found in object initializer");
        }
        let _loc1_ = 0;
        if (!this.isNextToken("}")) {
            _loc1_ += this.parse_propertyNameAndValueList();
        }
        if (!this.isToken("}")) {
            this.causeSyntaxError("\'}\' not found in object initializer");
        }
        this.nextToken();
        return _loc1_;
    }

    private parse_propertyNameAndValueList() {
        let _loc2_;
        let _loc1_ = 0;
        while (true) {
            this.parse_propertyName();
            if (!this.isToken(":")) {
                this.causeSyntaxError("\':\' not found in object name-value initializer");
            }
            this.nextToken();
            _loc2_ = new ExpressionResult();
            this.parse_assignmentExpression(_loc2_);
            this.generator.putExpressionResult(_loc2_);
            this.generator.putPush(_loc2_);
            _loc1_++;
            if (!this.isToken(",")) {
                break;
            }
            this.nextToken();
        }
        return _loc1_;
    }

    private parse_propertyName() {
        let _loc1_;
        switch (this.getToken().type) {
            case "identifier":
            case "string":
            case "number":
                _loc1_ = ExpressionResult.createLiteral(this.getToken().value);
                this.generator.putPush(_loc1_);
                this.nextToken();
                break;
            default:
                this.causeSyntaxError("unexpected token in property name");
        }
    }
}