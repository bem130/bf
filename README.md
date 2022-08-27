# Brain Fuck インタプリタ

run.js - BFi class

## 実装上の制限
メモリと標準出力が1024Bytesのみの実装になっています(修正予定)  

## 実行

BFiクラスを BrainFuckのコード,標準入力 で初期化します  
コードは文字列(String), 標準入力はバイト列です(Array,TypedArray)  

BFi.next 関数で1ステップ実行  
BFi.runall 関数で最後まで実行 (10000ステップの制限付き)  

```js
let code = ",."; // 標準入力の1文字目を出力するコード例

args = "hello"; // 標準入力のテキストデータ
argsb = new Uint8Array((new TextEncoder("utf-8")).encode(args)); // 標準入力をバイト列に変換

let runtime = new BFi(code,argsb); // 初期化
runtime.next(); // 1ステップ実行
runtime.runall(); // 最後まで実行
```

## 標準出力

BFi.getOut 関数で文字列として取得
BFi.getBinOut 関数で文字列として取得

```js
console.log(runtime.getOut());
console.log(runtime.getBinOut());
```

## 状態の取得

プログラム,プログラムカウンタ,メモリ,ポインタ の状態は取得することができます

BFi.getProg 関数でプログラムを取得
BFi.getData 関数でメモリを取得
BFi.getIptr 関数でプログラムカウンタを取得
BFi.getDptr 関数でポインタを取得

```js
console.log(runtime.getProg());
console.log(runtime.getData());
console.log(runtime.getIptr());
console.log(runtime.getDptr());
```