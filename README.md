# ぼっちラブカシミュレーター

一人でラブカできるサイト、要はちょっと賢いサイコロです。

## 点数計算法方
各デッキごとに１ターンに出せる点数を配列に保存します。値は他の方のノートなど参考しながら決めました。[このファイル](./src/utils/presets.ts)を参照してください。

いいデッキや数字があれば issues に投稿するか連絡してください！！！大歓迎です

```js
{
  id: 'purple-liella-aggro',
  deck: [2, 3, 5, 6],
  //...
}
```

点数はシグモイド関数でを決めます、xは0から1の乱数、aとbの値は難易度を示します。[このファイル](./src/utils/index.ts)を参照してください。

$$ y=\operatorname{round}\left(\frac{m}{1+e^{-ax+b}}\right) $$

この式のグラフもありますのでよかったら触ってみてください。[Desmos](https://www.desmos.com/calculator/sa6sbx9782)

なぜかSigmoid Function使ったかというと、0%と100%の確率が比較的に多い中、真ん中の値はいい感じにグラデーションするところです。

0%はライブ失敗する時とか、100%は理想のライブ成功してるケース、その真ん中はカード揃えないとかって感じです。

