class BF {
    prog; // プログラム
    data; // データ
    iptr; // プログラムポインタ
    dptr; // データポインタ
    istr; // 標準入力
    ostr; // 標準出力
    ispt; // 標準入力ポインタ
    ospt; // 標準出力ポインタ
    jadr; // ブラケットアドレス
    constructor(program="",args=[]) { // 初期化
        this.prog = this.tbyte(program);
        this.data = new Uint8Array(1024);
        this.iptr = 0;
        this.dptr = 0;
        this.istr = new Uint8Array(args);
        this.ostr = new Uint8Array(1024);
        this.ispt = 0;
        this.ospt = 0;
        this.jadr = this.sjadr(this.prog);
        this.skpc = 0;
    }
    next() { // 一つの命令を実行する
        switch (this.prog[this.iptr]) {
            case 0:
                this.dptr++; // nresize
            break;
            case 1:
                this.dptr--;
            break;
            case 2:
                this.data[this.dptr]++;
            break;
            case 3:
                this.data[this.dptr]--;
            break;
            case 4:
                this.ostr[this.ospt] = this.data[this.dptr];
                this.ospt++; // nresize
            break;
            case 5:
                this.data[this.dptr] = this.istr[this.ispt];
                this.ispt++;
            break;
            case 6:
                if (this.data[this.dptr]==0) {
                    this.iptr = this.jadr[this.iptr];
                }
            break;
            case 7:
                if (this.data[this.dptr]!=0) {
                    this.iptr = this.jadr[this.iptr];
                }
            break;
        }
        this.iptr++;
        return;
    }
    runall() { // 最後まで命令を実行する(最大10000)
        let cnt = 0;
        while (cnt<10000&&this.iptr<this.prog.length) {
            cnt++;
            this.next();
        }
        return this.getOut();
    }
    getOut() { // 出力を取得
        return (new TextDecoder("utf-8")).decode(new Uint8Array(this.ostr.slice(0,this.ospt)));
    }
    getBinOut() {
        return new Uint8Array(this.ostr.slice(0,this.ospt))
    }
    sjadr(prog) { // ジャンプ先を探す
        let jadr = new Uint8ClampedArray(prog.length);
        let ocnt = 0;
        let ccnt = 0;
        let oary = new Uint8ClampedArray(prog.length);
        let cary = new Uint8ClampedArray(prog.length);
        for (let i=0;i<prog.length;i++) {
            if (prog[i]==6) {
                oary[ocnt] = i;
                ocnt++;
            }
            else if (prog[i]==7) {
                cary[ccnt] = i;
                ccnt++;
            }
        }
        if (ocnt!=ccnt) {
            console.error("bracket number is not match");
        }
        for (let i=0;i<ocnt;i++) {
            jadr[oary[i]] = cary[i];
        }
        for (let i=0;i<ccnt;i++) {
            jadr[cary[i]] = oary[i];
        }
        return jadr;
    }
    tbyte(program) { // テキストを数値の配列に変換する
        let prog = new Uint8ClampedArray(program.length);
        let tptr = 0;
        for (let p=0;p<program.length;p++) {
            switch (program[p]) {
                case ">":
                    prog[tptr] = 0;
                break;
                case "<":
                    prog[tptr] = 1;
                break;
                case "+":
                    prog[tptr] = 2;
                break;
                case "-":
                    prog[tptr] = 3;
                break;
                case ".":
                    prog[tptr] = 4;
                break;
                case ",":
                    prog[tptr] = 5;
                break;
                case "[":
                    prog[tptr] = 6;
                break;
                case "]":
                    prog[tptr] = 7;
                break;
                default:
                    tptr--;
                break;
            }
            tptr++;
        }
        return prog;
    }
}