## 処理解説

本稿では、orientation_lib.jsの処理内容を解説します。

また本ライブラリでは、作者の手元にある端末でのみ動作確認をしていますので、全てのモバイルブラウザに対応しているわけではありません。  
仮に、本ライブラリが正常に動作しない端末がありましたら、下記の方法で対処できる場合があります。

## orientationchangeイベントの問題点

画面回転が行われた際、モバイルブラウザでは基本的にorientationchangeイベントが発行されますが、  
orientationchangeのイベントハンドラで、windowオブジェクトの縦幅、横幅を取得した場合、  
モバイルブラウザによっては、画面が回転する前の値しか取得する事ができないという問題があります。  
（これが本ライブラリを作成した経緯でもあります）

画面回転が行われた際、モバイルブラウザではresizeイベントが発行される事がありますが、  
resizeイベントハンドラで、windowオブジェクトの縦幅、横幅を取得した場合、  
画面回転後の値を取得する事ができますが、このハンドラでは画面の回転を判別する事ができません。  
（resizeイベントは、画面回転以外にも様々な契機で発行されます）

本ライブラリではこの二つを組み合わせることで、カスタムイベント（orientation_event）を発行し、
画面回転を検知しつつ、回転後の画面縦幅、横幅の値を取得を可能としています。

## 処理フロー

orientation_eventイベント発行までのフローは以下のようになっています。

1. onloadイベントハンドラにて、縦横orientationの値を保持します 
   （ここでのサイズ比較とorientationの値でportraitかlandscapeを判別するため） 
2. orientationchangeイベントで、画面切り替えを検出します
3. 直後に発生するresizeイベントで、カスタムイベント（orientation_event）を発行します
   （画面回転後の画面縦幅、横幅を取得するため）
4. その他のタイミングで発生するresizeイベントは無視します

※ ただし、orientationchangeとresizeの扱いがモバイルブラウザで差異がありますので、  
　 後述するパターン別でそれぞれ処理を分ける必要があります。

## orientationchangeとresizeの発行パターン

画面回転時、手元にある端末で調査を実施した所、
モバイルブラウザによって、orientationchangeイベントとresizeイベントの発行パターンは以下のようになっています。

* A ： orientationchange → resize 
* B ： orientationchange → resize → resize 
* C ： resize → orientationchange 
* D ： resize 
* E ： resize → resize → orientationchange

※ ただし、調査対象はSafari、Android標準ブラウザ、Mobile Chromeのみです。

## 各パターン別対応方法

上記パターンを元に、各ブラウザにおける本ライブラリの対応を以下のように分けました。

### Android 標準ブラウザ全般（パターンAに該当） 

orientationイベントハンドラで画面回転後のサイズ取得が出来ないケースなので、resizeイベントハンドラで取得します。  
orientation（フラグON）→resize（フラグONならカスタムイベントを生成します） 

### iOS Safari全般（パターンA、B、Cに該当） 

各バージョンでイベント順が違いますが、  
iOSの場合はorientationchangeイベントハンドラで画面回転後のサイズが取得できます。  
よって、resizeイベントは気にせず、orientationchangeイベントが発行されたら、カスタムイベントを生成します。 

### Mobile Chrome全般（パターンB、Eに該当） 

パターンBとEのどちらかがランダムで発行されますが、  
ChromeもSafariと同様にorientationchangeイベントハンドラで画面回転後のサイズが取得できます。  
よって、resizeイベント
は気にせず、orientationchangeイベントが発行されたら、カスタムイベントを生成します。 

### 例外ケース： IS11S 標準ブラウザ（パターンCに該当） 

Androidの中で唯一（？）パターンCの順でイベントが飛んできます。  
幸いなことに、orientationchangeで画面回転後のサイズが取得できますので、  
Safari、Chromeと同様にorientationchangeが発生したら、カスタムイベントを生成します。 

### 例外ケース： IS03[Android2.1-1]標準ブラウザ（パターンDに該当） 

Androidの中で唯一（？）orientationchangeイベントが発行されません。  
ですが、resizeイベントハンドラで画面回転後のサイズとwindow.orientation（画面の回転状態）が取得できますので、  
resizeイベント発行時に、window.orientationの値が前回値と違えば回転と見なし、カスタムイベントを生成します。

## パターンのまとめ
上記より、2つのパターンに集約可能です。

* パターン01 ： orientationchange → resizeのタイミングで画面幅を取得する必要があるケース
* パターン02 ： orientationchangeのみで画面幅を取得して問題ないケース

## 注意点

A～Eのパターンから外れたブラウザがある場合には、正常な動作が期待できず、動作保障外となってしまいますが、
A～Eのパターンに該当するものの、上記各パターン別対応方法に当てはまらないケースであれば、
（例えば、Mobile ChromeだがDのパターンに該当する場合）
例外定義を加えて頂く事で、動作可能な状態にリカバリすることができます。

## 例外定義の方法

本ライブラリのコンストラクタで、定数定義しているパターンに当該ブラウザの判別値を（複数指定可能）指定します。  
判別値はユーザエージェントから取得できる文字列とし、それとマッチしたブラウザは上記パターンではなく、  
こちらで定義したパターンでの処理を実施します。  
ただし、モバイルブラウザを限定できる文字列を定義するようにしてください。  
（例えば、`Chrome`などと定義してしまった場合には、Chrome全てが条件に当てはまってしまうので注意）

```
var CustomOrientationEvent = function() {
	this.PAT_01 = new Array(/Chrome\/33.0.1750.146/); // ChromeのVersion33.0.1750.146でアクセスした時のみ
	this.PAT_02 = new Array(/SonyEricssonIS11S/);
```
