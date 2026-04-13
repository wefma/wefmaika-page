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

追記：

どこにlevel-sceneの情報を入れるか…

```sql
thscoreboard=# select * from replays_game;
 game_id | has_replays | num_difficulties
---------+-------------+------------------
 th01    | f           |                4
 th02    | f           |                5
 th03    | f           |                5
 th04    | f           |                5
 th05    | f           |                5
 th06    | t           |                5
 th07    | t           |                6
 th08    | t           |                5
 th09    | t           |                5
 th10    | t           |                5
 th11    | t           |                5
 th12    | t           |                5
 th128   | t           |                5
 th13    | t           |                6
 th14    | t           |                5
 th15    | t           |                5
 th16    | t           |                5
 th17    | t           |                5
 th18    | t           |                5
 th20    | t           |                5
 alco    | t           |                0
(21 rows)

thscoreboard=# select * from replays_route;
 id | route_id | order_number | game_id
----+----------+--------------+---------
  1 | Jigoku   |            0 | th01
  2 | Makai    |            1 | th01
  3 | Final A  |            0 | th08
  4 | Final B  |            1 | th08
  5 | A-1      |            0 | th128
  6 | A-2      |            1 | th128
  7 | B-1      |            2 | th128
  8 | B-2      |            3 | th128
  9 | C-1      |            4 | th128
 10 | C-2      |            5 | th128
(10 rows)

thscoreboard=#
```
