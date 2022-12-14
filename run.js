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
        if (this.endRunning()) {console.warn("end runnning")}
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
        while (cnt<10000&&!this.endRunning()) {cnt++;this.next();}
        return this;
    }
    #sjadr(prog) { // ジャンプ先を探す
        let bcnt = 0;
        let jadr = new Uint8ClampedArray(prog.length);
        for (let i=0;i<prog.length;i++) {
            if (prog[i]==6) {
                bcnt++;
                let opni = i;
                let opnb = bcnt+1;
                let clsi = 0;
                for (let j=i;j<prog.length;j++) {
                    if (prog[j]==6) {
                        bcnt++;
                    }
                    else if (prog[j]==7) {
                        console.log(bcnt,opnb)
                        if (bcnt==opnb) {
                            console.log("found")
                            clsi = j
                            break
                        }
                        bcnt--;
                    }
                }
                jadr[opni] = clsi;
                jadr[clsi] = opni;
            }
            else if (prog[i]==7) {
                bcnt--;
            }
        }
        console.log(bcnt)
        if (bcnt!=1) {console.error("bracket number is not match");}
        console.log(jadr)
        return jadr;
    }
    tbyte(program,pass=true) { // テキストを数値の配列に変換する
        let prog = new Uint8ClampedArray(program.length);let tptr = 0;
        let ins = [">","<","+","-",".",",","[","]"];
        for (let p=0;p<program.length;p++) {
            let tins = ins.indexOf(program[p]);
            if (tins==-1) { if(pass){continue;} tins=8;}
            prog[tptr] = tins; tptr++;
        }
        return prog;
    }
    endRunning() {if(this.#iptr>=this.#prog.length){return true};return false;}
    nextRead() {if(this.#prog[this.#iptr]==5){return true};return false;}
    getOut(format="utf-8") {return (new TextDecoder(format)).decode(new Uint8Array(this.#ostr.slice(0,this.#ospt)));} // 出力をテキストで取得
    getBinOut() {return new Uint8Array(this.#ostr.slice(0,this.#ospt))} // 出力を配列で取得
    getProg() {return this.#prog}
    getData() {return this.#data}
    getIptr() {return this.#iptr}
    getDptr() {return this.#dptr}
}