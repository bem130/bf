class BFi {
    #prog;#data;#iptr;#dptr;#istr;#ostr;#ispt;#ospt;#jadr; // 宣言
    constructor(program,args=[0],pass=true) { // 初期化
        this.#prog = this.tbyte(program,pass); // プログラム
        this.#jadr = this.#sjadr(this.#prog); // ブラケットアドレス
        this.#data = new Uint8Array(1024); // データ
        this.#istr = new Uint8Array(args); // 標準入力
        this.#ostr = new Uint8Array(1024); // 標準出力
        this.#iptr = 0; // プログラムポインタ
        this.#dptr = 0; // データポインタ
        this.#ispt = 0; // 標準入力ポインタ
        this.#ospt = 0; // 標準出力ポインタ
    }
    next() { // 一つの命令を実行する
        if (this.#iptr>=this.#prog.length) {console.warn("end runnning")}
        switch (this.#prog[this.#iptr]) {
            case 0:
                this.#dptr++; // nresize
            break;
            case 1:
                this.#dptr--;
            break;
            case 2:
                this.#data[this.#dptr]++;
            break;
            case 3:
                this.#data[this.#dptr]--;
            break;
            case 4:
                this.#ostr[this.#ospt] = this.#data[this.#dptr];
                this.#ospt++; // nresize
            break;
            case 5:
                this.#data[this.#dptr] = this.#istr[this.#ispt];
                this.#ispt++;
            break;
            case 6:
                if (this.#data[this.#dptr]==0) {this.#iptr = this.#jadr[this.#iptr];}
            break;
            case 7:
                if (this.#data[this.#dptr]!=0) {this.#iptr = this.#jadr[this.#iptr];}
            break;
            default:
            break;
        }
        this.#iptr++;
        return this;
    }
    runall() { // 最後まで命令を実行する(最大10000)
        let cnt = 0;
        while (cnt<10000&&this.#iptr<this.#prog.length) {cnt++;this.next();}
        return this;
    }
    #sjadr(prog) { // ジャンプ先を探す
        let ocnt = 0; let ccnt = 0;
        let jadr = new Uint8ClampedArray(prog.length);
        let oary = new Uint8ClampedArray(prog.length);
        let cary = new Uint8ClampedArray(prog.length);
        for (let i=0;i<prog.length;i++) {
            if (prog[i]==6) {oary[ocnt] = i; ocnt++;}
            else if (prog[i]==7) {cary[ccnt] = i; ccnt++;}
        }
        if (ocnt!=ccnt) {console.error("bracket number is not match");}
        for (let i=0;i<ocnt;i++) {jadr[oary[i]] = cary[i];}
        for (let i=0;i<ccnt;i++) {jadr[cary[i]] = oary[i];}
        return jadr;
    }
    tbyte(program,pass=true) { // テキストを数値の配列に変換する
        let prog = new Uint8ClampedArray(program.length);let tptr = 0;
        let ins = [">","<","+","-",".",",","[","]"];
        for (let p=0;p<program.length;p++) {
            let tins = ins.indexOf(program[p])
            if (tins==-1) { if(pass){continue;} tins=8;}
            prog[tptr] = tins; tptr++;
        }
        return prog;
    }
    getOut(format="utf-8") {return (new TextDecoder(format)).decode(new Uint8Array(this.#ostr.slice(0,this.#ospt)));} // 出力をテキストで取得
    getBinOut() {return new Uint8Array(this.#ostr.slice(0,this.#ospt))} // 出力を配列で取得
    getProg() {return this.#prog}
    getData() {return this.#data}
    getIptr() {return this.#iptr}
    getDptr() {return this.#dptr}
}