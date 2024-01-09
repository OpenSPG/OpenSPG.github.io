---
title: 快速安装
nav:
  order: 2
  title: 安装&教程
  second:
    order: 1
---

## 1 安装服务端

服务端基于docker compose部署，主要包含4个镜像：

| 镜像           | 说明           |
| -------------- | -------------- |
| openspg-server | 提供schema服务 |
| openspg-mysql  | 存储schema数据 |
| tugraph        | 存储图谱数据   |
| elasticsearch  | 索引图谱数据   |

下载 [docker-compose.yml](https://github.com/OpenSPG/openspg/blob/master/dev/release/docker-compose.yml)
文件，并在当前目录下执行以下命令，等待命令执行完成即完成服务端启动：

```bash
docker-compose -f docker-compose.yml up -d
```

## 2 安装客户端

客户端也提供了docker镜像，直接执行以下命令会拉取该镜像：

```bash
docker pull --platform linux/x86_64 openspg/openspg-python:latest
```

下载完镜像后，可以克隆OpenSPG源码：
```bash
git clone git@github.com:OpenSPG/openspg.git
```

源码克隆完成后，可以体验源码中自带的案例：

```bash
# 启动容器，将其中的${project_dir}替换成源码目录
docker run --rm --net=host -v ${project_dir}:/code \
  -it openspg/openspg-python:latest \
  "/bin/bash"
  
# 容器启动后，进入/code目录，即openspg项目源码目录
cd /code

# 后续可以安装案例教程，比如进入riskmining目录
cd python/knext/knext/examples/riskmining

# 参考案例教程，执行相应的knext命令，比如
knext project create --prj_path .
knext schema commit

knext builder execute ...
knext reasoner execute ...
```

另外，当本地基于IDE去编写图谱项目时，可以执行以下命令安装knext：

```bash
pip install openspg-knext
```
