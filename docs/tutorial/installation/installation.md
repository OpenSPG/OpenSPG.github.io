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

### 案例体验

拉取完镜像后，如果想体验OpenSPG提供的案例，可以启动容器后，进入案例的目录执行相应knext命令：

```bash
# 启动容器
docker run --rm --net=host \
  -it openspg/openspg-python-amd64:latest \
  "/bin/bash"

# 容器启动后，可以直接进入openspg提供的案例目录，就可以按照教程体验例案例了
cd /openspg/python/knext/knext/examples

# 参考案例教程，执行相应的knext命令，比如
knext project create --prj_path .
knext schema commit

knext builder execute ...
knext reasoner execute ...
```

### 项目开发

如果期望基于OpenSPG新建项目，可以使用下面的命令启动容器

```bash
# 启动容器，并将本地的项目目录挂载到docker的/code目录中
docker run --rm --net=host -v ${project_dir}:/code \
    -it openspg/openspg-python-amd64:latest \
    "/bin/bash"

# 容器启动后，可以直接进入/code目录
cd /code

# 创建OpenSPG项目
knext project create --name ${项目名} --namespace ${项目命名空间}

# 上述命令执行成功后，会在/code下创建一个名称为${项目命名空间}的knext工程目录
# 进入该目录后，可以看到schema、builder、reasoner三个目录
cd ${项目命名空间}
```

如果使用PyCharm等IDE来开发该knext工程，也可以将${project_dir}目录下的${项目命名空间}拖到PyCharm中。

同时本地安装openspg-knext进入开发。由于本目录已挂在到docker中，开发完成后在docker中执行knext命令即可

```bash
pip install openspg-knext
```
