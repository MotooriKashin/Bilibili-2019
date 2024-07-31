import { Token } from "./Token";
import { VMSyntaxError } from "./VMSyntaxError";

export class Scanner {

    private index = 0;

    private linesCount = 0;

    constructor(private source: string) {
        this.rewind();
    }

    rewind() {
        this.index = 0;
        this.linesCount = 0;
    }

    getLineNumber() {
        return this.linesCount + 1;
    }

    getLine() {
        return this.source.split("\n")[this.linesCount];
    }

    private getChar() {
        return this.source.charAt(this.index);
    }

    private nextChar() {
        if (this.getChar() == "\n") {
            ++this.linesCount;
        }
        return this.source.charAt(++this.index);
    }

    private isSpace(char: string) {
        return char == " " || char == "\t" || char == "\r" || char == "\n";
    }

    private isAlphabet(str: string) {
        const d = str.charCodeAt(0);
        return 65 <= d && d <= 90 || 97 <= d && d <= 122;
    }

    private isNumber(str: string) {
        const d = str.charCodeAt(0);
        return 48 <= d && d <= 57;
    }

    private isAlphabetOrNumber(str: string) {
        const d = str.charCodeAt(0);
        return 48 <= d && d <= 57 || 65 <= d && d <= 90 || 97 <= d && d <= 122;
    }

    private isHex(str: string) {
        const d = str.charCodeAt(0);
        return 48 <= d && d <= 57 || 65 <= d && d <= 70 || 97 <= d && d <= 102;
    }

    private isIdentifier(str: string) {
        const d = str.charCodeAt(0);
        return d == 36 || d == 95 || 48 <= d && d <= 57 || 65 <= d && d <= 90 || 97 <= d && d <= 122;
    }

    getToken(): any {
        let _loc1_ = this.getChar();
        let _loc2_;
        let _loc3_;
        let _loc4_;
        let _loc5_;
        while (this.isSpace(_loc1_)) {
            _loc1_ = this.nextChar();
        }
        if (!_loc1_) {
            return null;
        }
        if (this.isAlphabet(_loc1_) || _loc1_ == "$" || _loc1_ == "_") {
            _loc2_ = _loc1_;
            while ((_loc1_ = this.nextChar()) && this.isIdentifier(_loc1_)) {
                _loc2_ += _loc1_;
            }
            _loc3_ = _loc2_.toLowerCase();
            switch (_loc3_) {
                case "break":
                case "case":
                case "continue":
                case "default":
                case "delete":
                case "do":
                case "else":
                case "for":
                case "function":
                case "if":
                case "instanceof":
                case "new":
                case "return":
                case "switch":
                case "this":
                case "typeof":
                case "var":
                case "while":
                case "with":
                case "coroutine":
                case "suspend":
                case "yield":
                case "loop":
                    return new Token(_loc3_, null);
                case "null":
                    return new Token("null", null);
                case "undefined":
                    return new Token("undefined", undefined);
                case "true":
                    return new Token("bool", true);
                case "false":
                    return new Token("bool", false);
                default:
                    return new Token("identifier", _loc2_);
            }
        } else {
            if (this.isNumber(_loc1_)) {
                _loc2_ = _loc1_;
                if (_loc1_ == "0") {
                    if ((_loc1_ = this.nextChar()) && _loc1_ == "x" || _loc1_ == "X") {
                        _loc2_ += _loc1_;
                        while ((_loc1_ = this.nextChar()) && this.isHex(_loc1_)) {
                            _loc2_ += _loc1_;
                        }
                    }
                    else if (this.isNumber(_loc1_)) {
                        _loc2_ += _loc1_;
                        while ((_loc1_ = this.nextChar()) && this.isNumber(_loc1_)) {
                            _loc2_ += _loc1_;
                        }
                    }
                }
                else {
                    while ((_loc1_ = this.nextChar()) && this.isNumber(_loc1_)) {
                        _loc2_ += _loc1_;
                    }
                }
                if (_loc1_ == ".") {
                    _loc2_ += _loc1_;
                    while ((_loc1_ = this.nextChar()) && this.isNumber(_loc1_)) {
                        _loc2_ += _loc1_;
                    }
                    return new Token("number", parseFloat(_loc2_));
                }
                return new Token("number", parseInt(_loc2_));
            }
            if (_loc1_ == "\'") {
                _loc2_ = "";
                while ((_loc1_ = this.nextChar()) && _loc1_ != "\'") {
                    if (_loc1_ == "\\") {
                        _loc1_ = this.nextChar();
                        if (_loc1_ == "n") {
                            _loc2_ += "\n";
                            continue;
                        }
                        if (_loc1_ == "t") {
                            _loc2_ += "\t";
                            continue;
                        }
                        if (_loc1_ == "r") {
                            _loc2_ += "\r";
                            continue;
                        }
                        if (_loc1_ == "x") {
                            _loc4_ = this.nextChar();
                            _loc5_ = this.nextChar();
                            _loc2_ += String.fromCharCode(parseInt("0x" + _loc4_ + _loc5_));
                            continue;
                        }
                        if (_loc1_ == "0") {
                            _loc4_ = this.nextChar();
                            _loc5_ = this.nextChar();
                            _loc2_ += String.fromCharCode(parseInt(_loc4_ + _loc5_, 8));
                            continue;
                        }
                        if (_loc1_ == "\\") {
                            _loc2_ += "\\";
                            continue;
                        }
                    }
                    _loc2_ += _loc1_;
                }
                if (_loc1_ != "\'") {
                    throw new VMSyntaxError("String literal is not closed.");
                }
                this.nextChar();
                return new Token("string", _loc2_);
            }
            if (_loc1_ == "\"") {
                _loc2_ = "";
                while ((_loc1_ = this.nextChar()) && _loc1_ != "\"") {
                    if (_loc1_ == "\\") {
                        _loc1_ = this.nextChar();
                        if (_loc1_ == "n") {
                            _loc2_ += "\n";
                            continue;
                        }
                        if (_loc1_ == "t") {
                            _loc2_ += "\t";
                            continue;
                        }
                        if (_loc1_ == "r") {
                            _loc2_ += "\r";
                            continue;
                        }
                        if (_loc1_ == "x") {
                            _loc4_ = this.nextChar();
                            _loc5_ = this.nextChar();
                            _loc2_ += String.fromCharCode(parseInt("0x" + _loc4_ + _loc5_));
                            continue;
                        }
                        if (_loc1_ == "0") {
                            _loc4_ = this.nextChar();
                            _loc5_ = this.nextChar();
                            _loc2_ += String.fromCharCode(parseInt(_loc4_ + _loc5_, 8));
                            continue;
                        }
                        if (_loc1_ == "\\") {
                            _loc2_ += "\\";
                            continue;
                        }
                    }
                    _loc2_ += _loc1_;
                }
                if (_loc1_ != "\"") {
                    throw new VMSyntaxError("String literal is not closed.");
                }
                this.nextChar();
                return new Token("string", _loc2_);
            }
            if (_loc1_ == "/") {
                if (_loc1_ = this.nextChar()) {
                    if (_loc1_ == "=") {
                        this.nextChar();
                        return new Token("/=", null);
                    }
                    if (_loc1_ == "/") {
                        while ((_loc1_ = this.nextChar()) && _loc1_ != "\n") {
                        }
                        this.nextChar();
                        return this.getToken();
                    }
                    if (_loc1_ == "*") {
                        _loc1_ = this.nextChar();
                        while (_loc1_) {
                            if (_loc1_ == "*") {
                                if ((_loc1_ = this.nextChar()) && _loc1_ == "/") {
                                    break;
                                }
                            }
                            else {
                                _loc1_ = this.nextChar();
                            }
                        }
                        this.nextChar();
                        return this.getToken();
                    }
                }
                return new Token("/", null);
            }
            if (_loc1_ == "*" || _loc1_ == "%" || _loc1_ == "^") {
                _loc3_ = _loc1_;
                if ((_loc1_ = this.nextChar()) && _loc1_ == "=") {
                    this.nextChar();
                    return new Token(_loc3_ + "=", null);
                }
                return new Token(_loc3_, null);
            }
            if (_loc1_ == "+" || _loc1_ == "-" || _loc1_ == "|" || _loc1_ == "&") {
                _loc3_ = _loc1_;
                if (_loc1_ = this.nextChar()) {
                    if (_loc1_ == _loc3_) {
                        this.nextChar();
                        return new Token(_loc3_ + _loc3_, null);
                    }
                    if (_loc1_ == "=") {
                        this.nextChar();
                        return new Token(_loc3_ + "=", null);
                    }
                }
                return new Token(_loc3_, null);
            }
            if (_loc1_ == "=" || _loc1_ == "!") {
                _loc3_ = _loc1_;
                if ((_loc1_ = this.nextChar()) && _loc1_ == "=") {
                    if ((_loc1_ = this.nextChar()) && _loc1_ == "=") {
                        this.nextChar();
                        return new Token(_loc3_ + "==", null);
                    }
                    return new Token(_loc3_ + "=", null);
                }
                return new Token(_loc3_, null);
            }
            if (_loc1_ == ">" || _loc1_ == "<") {
                _loc3_ = _loc1_;
                if (_loc1_ = this.nextChar()) {
                    if (_loc1_ == "=") {
                        this.nextChar();
                        return new Token(_loc3_ + "=", null);
                    }
                    if (_loc1_ == _loc3_) {
                        if (_loc1_ = this.nextChar()) {
                            if (_loc3_ == ">" && _loc1_ == ">") {
                                if ((_loc1_ = this.nextChar()) && _loc1_ == "=") {
                                    this.nextChar();
                                    return new Token(">>>=", null);
                                }
                                return new Token(">>>", null);
                            }
                            if (_loc1_ == "=") {
                                this.nextChar();
                                return new Token(_loc3_ + _loc3_ + "=", null);
                            }
                        }
                        return new Token(_loc3_ + _loc3_, null);
                    }
                }
                return new Token(_loc3_, null);
            }
            switch (_loc1_) {
                case "{":
                case "}":
                case "(":
                case ")":
                case "[":
                case "]":
                case ".":
                case ";":
                case ",":
                case "~":
                case "?":
                case ":":
                    this.nextChar();
                    return new Token(_loc1_, null);
                default:
                    throw new VMSyntaxError("Unknown character : \"" + _loc1_ + "\" at index " + this.index + ".");
            }
        }
    }
}