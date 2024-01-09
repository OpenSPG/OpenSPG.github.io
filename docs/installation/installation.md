## 安装流程
### 1 安装客户端
提供两种安装方式：

- 第一种：使用pip install直接安装knext的python sdk。
- 第二种：通过我们已经准备好的docker镜像进行安装。

安装说明如下：
#### 1.1 pip 安装
前置依赖：本地已安装JDK8。

```python
pip install openspg-knext
```

#### 1.2 docker安装
相关依赖已经在docker镜像中。
```python
# 拉取镜像
docker pull openspg/openspg-python:latest

# 启动镜像，将本地的code_dir挂载到容器中的/code目录
docker run --rm --net=host -v  ${code_dir}:/code \
	-it openspg/openspg-python-amd64:latest \
	"/bin/bash"

# 进入容器后，就可以执行以下命令执行knext相关命令
cd /code
knext --version
```
### 2 安装服务端
下载 [docker-compose.yml](https://yuque.antfin.com/attachments/lark/0/2024/yml/1062/1704528657529-91545b52-1f6c-489f-874e-d553e81df211.yml?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fyuque.antfin.com%2Fattachments%2Flark%2F0%2F2024%2Fyml%2F1062%2F1704528657529-91545b52-1f6c-489f-874e-d553e81df211.yml%22%2C%22name%22%3A%22docker-compose.yml%22%2C%22size%22%3A1450%2C%22ext%22%3A%22yml%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22u2f915c31-b1e2-470d-962c-c8c7caed095%22%2C%22taskType%22%3A%22transfer%22%2C%22type%22%3A%22application%2Fx-yaml%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22u7e01c96c%22%2C%22card%22%3A%22file%22%7D) 文件，并在当前目录下执行以下命令：

```python
docker-compose -f docker-compose.yml up -d
```
