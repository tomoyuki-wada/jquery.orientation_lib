## 概要
本ライブラリは、モバイルブラウザにおける画面回転（ポートレート⇔ランドスケープ）を行った際に、
回転イベントの発行、回転イベントハンドラ内での、画面回転後の画面幅の取得が可能です。

## ライセンス
本ライブラリは、MITライセンスで提供されるフリーソフトウェアであり、個人ユース、商用を問わず無料で利用することができます。

## 対象ブラウザ
* Mobile Safari（iOS Version4.0以上）
* Android 標準ブラウザ（Android Version2.1以上）
* Mobile Chrome（Version18以上）

## 動作環境
jQuery v1.7.2以上で動作します。  
本ライブラリよりも先に、jQuery本体を読み込む必要があります。

```
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="jquery.orientation_lib.js"></script>
```

## パラメータ
本ライブラリでは、以下のパラメータをorientation_eventイベントハンドラ内で取得できます。

* `orientation(string:"portrait" or "landscape")` ： 画面表示状態（ポートレート、ランドスケープ）
* `width(int)` ： 現画面状態の画面横幅（解像度/pixcelRatioの理論値）
* `height(int)` ： 現画面状態の画面縦幅（解像度/pixcelRatioの理論値）
* `availWidth(int)` : 利用可能な画面横幅（端末の固定領域等を含まない描画領域のサイズ）
* `availHeight(int)` : 利用可能な画面縦幅（ブラウザのヘッダ等領域を含まない描画領域のサイズ）

## 利用例
orientation_eventイベントハンドラを定義します。

```
$(window).on('orientation_event', function(ev) {
    var orientation_str = "ORIENTATION: " + ev.orientation + "\n";
    orientation_str += "WIDTH: " + ev.width + "\n";
    orientation_str += "HEIGHT: " + ev.height + "\n";
    orientation_str += "A_WIDTH: " + ev.availWidth + "\n";
    orientation_str += "A_HEIGHT: " + ev.availHeight + "\n";
    alert(orientation_str);
});
```

