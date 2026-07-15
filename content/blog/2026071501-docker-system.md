---
title: dockerコンテナの仕組みを理解する
description: dockerの仕組みを理解する
date: 2026-07-15
image: /blog/default.webp
minRead: 5
---

# dockerネットワークの仕組みを理解する

dockerはなんかよくわかんねーけどマシン内で仮想マシンっぽい何かを作る技術だ。
cgroupやネームスペース、chroot等のカーネルAPIを使用することで実現しているが、今回はネットワークをどうやって実現しているか図解して理解した。

## ネットワーク

ネットワークのネームスペースを分けることによりこのような形でネットワークが分断されている。

![dockerネットワーク](/blog/2026071501-docker-system/docker-network.webp "dockerネットワーク")

この図を見るとホストがNATのように振る舞っていることが分かるし、
ホスト上で `ip addr show` コマンドを打つとdockerという名前のNIC(Network Interface Card)がなぜ存在するか分かる。
よく初心者がミスるコンテナ上でホストのプロセスを叩こうとして `localhost` に通信しようとしたのに何故かアクセスできないのもこの図を見ればよく理解できる。
コンテナからネットワークに出ていく通信に制限を加える場合は `nftables` の `forward` に入れなければいけないことも注意だ。
