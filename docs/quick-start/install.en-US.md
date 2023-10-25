---
title: Quick installation
order: 2
---

## 1 Background

OpenSPG is developed based on Java & Python, the server side developed using the open-source framework [`SOFABoot`](https://www.sofastack.tech/projects/sofa-boot/overview/) from Ant Group, and the client side developed using Python3. The standalone version requires `Mysql` for storing server-side metadata and `ElasticSearch` for indexing the SPG data.

The server side of OpenSPG can be quickly installed using `Docker Compose`. The relevant image addresses can be found at [`Docker Images`](https://hub.docker.com/repositories/baifuyu), which includes the following two images:


| Module Name   | Image Name                   | Description                       |
|---------------|------------------------------|-----------------------------------|
| openspg       | baifuyu/openspg:latest       | The server image of OpenSPG, developed based on Java |
| openspg-mysql | baifuyu/openspg-mysql:latest | The database image of OpenSPG that initializes some tables and data, based on Mysql |

In addition to the above 2 Docker images, to start the OpenSPG service, you also need 2 additional Docker images:

| Module Name           | Image Name                    | Description             |
|---------------|---------------------------------------|-------------------------|
| tugraph       | tugraph/tugraph-runtime-centos7:4.0.1 | The graph storage image of OpenSPG, used for storing graph data  |
| elasticsearch | elasticsearch:8.5.3                   | The search engine image of OpenSPG, used for indexing the SPG data |

The OpenSPG client can be installed using the `pip` package management tool for `Python`, with a minimum required version of `Python` being >=3.8.

## 2 Quick installation

### 2.1 Client Installation

To quickly install the client, execute the following command:

```bash
pip install openspg-knext
```

To verify if the `OpenSPG` client has been successfully installed, use the `knext` command:

```bash
knext --version
```

### 2.2 Server Installation

1. Install `Docker` on your local machine.  <br>
   You can refer to the official documentation for the environment setup: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

2. The `Docker Compose` configuration file is as follows. Copy the following content and save it as `docker-compose.yml` on your local machine. Then, use the following command to start the installation:

```bash
docker-compose -f docker-compose.yml up -d
```

The content of `the docker-compose.yml` file is as follows:

```yaml
version: "3.7"
services:
  openspg:
    restart: always
    image: baifuyu/openspg:latest
    container_name: release-openspg
    ports:
      - "8887:8887"
    depends_on:
      - mysql
      - tugraph
      - elasticsearch
    command: [
      '--cloudext.repository.impl.jdbc.host=mysql',
      '--builder.operator.python.exec=/usr/bin/python3.8',
      '--builder.operator.python.paths=/usr/lib/python3.8/site-packages;/usr/local/lib/python3.8/dist-packages;'
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
      - "3306:3306"
    command: [
      '--character-set-server=utf8mb4',
      '--collation-server=utf8mb4_general_ci'
    ]

  tugraph:
    image: tugraph/tugraph-runtime-centos7:4.0.1
    container_name: release-openspg-tugraph
    # default username is admin and default password is 73@TuGraph
    ports:
      - "7070:7070"
      - "9090:9090"
    command: lgraph_server

  elasticsearch:
    image: elasticsearch:8.5.3
    container_name: test-openspg-elasticsearch
    ports:
      - "9200:9200"
      - "9300:9300"
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
```

During the first installation, Docker images for the above 4 services need to be downloaded. The downloading speed might be a bit slow. Please be patient and wait.

Once the server and client are installed and started, we can begin creating our first knowledge graph.

**Related documentation**：

1. [KNext command tool and SDK Tutorial](doc/core/knext_tutorial_en.md)
2. [Enterprise Supply Chain Knowledge Graph](./doc/example/EnterpriseSupplyChain/enterprise_supply_chain_introduce_quickstart_en.md)
3. [Risk Mining Knowledge Graph](./doc/example/RiskMining/risk_mining_introduce_quickstart_en.md)
4. [Medical Knowledge Graph](./doc/example/Medical/medical_introduce_quickstart_en.md)
