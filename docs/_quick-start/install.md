---
title: 快速安装
order: 2
---

## 1 安装简要

`OpenSPG`基于`Java`&`Python`开发，其中服务端是基于蚂蚁蚂蚁的开源框架[`SOFABoot`](https://www.sofastack.tech/projects/sofa-boot/overview/)开发，客户端是基于`Python3`开发。
单机版可运行的环境还包括`Mysql`用于存储服务端元数据，`ElasticSearch`用于索引SPG数据。

`OpenSPG`服务端可以通过`Docker Compose`快速安装，相关的镜像地址请[点击](https://hub.docker.com/repositories/baifuyu)，该链接中包含了以下2个镜像：

| 模块名        | 镜像名                       | 说明                                             |
| ------------- | ---------------------------- | ------------------------------------------------ |
| openspg       | baifuyu/openspg:latest       | OpenSPG服务端镜像，基于Java开发                  |
| openspg-mysql | baifuyu/openspg-mysql:latest | OpenSPG Mysql镜像，基于Mysql初始化了一些表和数据 |

除了以上2个Docker镜像，要启动OpenSPG服务，还需要另外2个Docker镜像：

| 模块名        | 镜像名                                | 说明                                 |
| ------------- | ------------------------------------- | ------------------------------------ |
| tugraph       | tugraph/tugraph-runtime-centos7:4.0.1 | OpenSPG图存储镜像，用于存储图谱数据  |
| elasticsearch | elasticsearch:8.5.3                   | OpenSPG搜索存储镜像，用于索引SPG数据 |

`OpenSPG`客户端通过`Python`包管理工具`pip`工具安装，`Python`版本要求>=3.8；

## 2 快速安装

### 2.1 客户端安装：

执行以下命令可以快速安装：

```bash
pip install openspg-knext
```

检验`OpenSPG`客户端是否安装成功，其中`knext`是客户端命令；

```bash
knext --version
```

### 2.2 服务端安装：

1. 本地安装`Docker` <br>
   环境可参考官方文档：[https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

2. `Docker Compose`配置文件如下，将该配置复制到本地文件并命名为`docker-compose.yml`，再使用以下命令启动

```bash
docker-compose -f docker-compose.yml up -d
```

其中`docker-compose.yml`文件内容：

```yaml
version: '3.7'
services:
  openspg:
    restart: always
    image: baifuyu/openspg:latest
    container_name: release-openspg
    ports:
      - '8887:8887'
    depends_on:
      - mysql
      - tugraph
      - elasticsearch
    command:
      [
        '--cloudext.repository.impl.jdbc.host=mysql',
        '--builder.operator.python.exec=/usr/bin/python3.8',
        '--builder.operator.python.paths=/usr/lib/python3.8/site-packages;/usr/local/lib/python3.8/dist-packages;',
      ]
    environment:
      - PYTHONPATH=/usr/lib/python3.8/site-packages:/usr/local/lib/python3.8/dist-packages

  mysql:
    restart: always
    image: baifuyu/openspg-mysql:latest
    container_name: release-openspg-mysql
    environment:
      TZ: Asia/Shanghai
      LANG: C.UTF-8
    ports:
      - '3306:3306'
    command:
      [
        '--character-set-server=utf8mb4',
        '--collation-server=utf8mb4_general_ci',
      ]

  tugraph:
    image: tugraph/tugraph-runtime-centos7:4.0.1
    container_name: release-openspg-tugraph
    # default username is admin and default password is 73@TuGraph
    ports:
      - '7070:7070'
      - '9090:9090'
    command: lgraph_server

  elasticsearch:
    image: elasticsearch:8.5.3
    container_name: test-openspg-elasticsearch
    ports:
      - '9200:9200'
      - '9300:9300'
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
```

第一次使用需要下载以上4个服务的Docker镜像，速度会有点慢，请耐心等待~。

等服务端与客户端都安装启动完成后，接下来就可以创建我们的第一个图谱了。

**相关文档链接**：

1. [KNext命令行工具和SDK教程](../tutorial/knext/index.md)
2. [企业供应链图谱](../example/enterprise-supply-chain/index.md)
3. [黑产挖掘图谱](../example/risk-mining/index.md)
4. [医疗知识图谱](../example/medical/index.md)
