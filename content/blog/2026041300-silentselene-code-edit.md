---
title: サイレントセレナに文花帖系作品追加してぇなぁ
description: コードの理解メモ
date: 2026-04-13
image: /blog/default.webp
minRead: 3
---

# サイレントセレナのコードの解釈をつらつら書く

[thscoreboard/project/thscoreboard/thscoreboard/urls.py](https://github.com/n-rook/thscoreboard/blob/main/project/thscoreboard/thscoreboard/urls.py) がエントリポイント。 以下 `thscoreboard/project/thscoreboard` のパスは省略する。

`/replays` 配下にアクセスするときは[replays/urls/replay_urls.py](https://github.com/n-rook/thscoreboard/blob/main/project/thscoreboard/replays/urls/replay_urls.py) にアクセスする.
この時ゲーム毎のリプレイページ[^example-replay-game]は [replays/views/replay_list.py](https://github.com/n-rook/thscoreboard/blob/main/project/thscoreboard/replays/views/replay_list.py#L50-L73) にてレンダリングされる。
なおこの時レンダリング元のhtmlは [replays/templates/replays/game_scoreboard.html](https://github.com/n-rook/thscoreboard/blob/main/project/thscoreboard/replays/templates/replays/game_scoreboard.html) であり、これは [replays/templates/replays/replay_table.html](https://github.com/n-rook/thscoreboard/blob/main/project/thscoreboard/replays/templates/replays/replay_table.html) をインクルードしている。

[^example-replay-game]: https://www.silentselene.net/replays/th128

ここでレンダリング時に `game`, `filters`, `show_route` を渡している。

`filters` にはボタン選択でフィルタするための要素が渡される。
文花帖系作品であればレベルとシーンが渡るのであろう。

`show_route` はテーブルの1つのデータにルートを表示するかのbool値である。
通常であればテーブルには `User`, `Difficulty`, `Shot`, `Score`, `Upload Date`, `Comment` が表示されるが、これがあれば `Route` が表示されることになる。
靈異伝, 永夜抄, 妖精大戦争はルートが存在するのでこれを `True` にすることで表示させる。
もし仮にそれ以外の作品で `True` にしてしまうと空の `Route` 列が表示されてしまう。
文花帖系作品を実装するならデータ列にLevel-Sceneを追加するのが自然であろう。
つまり `show_level_scene` というbool変数を追加して、これによってテーブルの表示を制御すべきだ。

あとは[過去の自分の黄昏酒場のプルリクエスト](https://github.com/n-rook/thscoreboard/pull/546)を見てれば書けると思った。
