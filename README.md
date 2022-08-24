# nusgae

一个简单的基于 Nodejs 开发的磁盘占用产看工具。支持 Windows/Mac/Linux。支持 node10+

## 安装

使用 npm

```bash
npm install @jaocer/nusage -g
```

使用 yarn

```bash
yarn global add @jaocer/nusage
```

## 使用

可以在任意目录执行

```bash
nu
# 或者
nusage
# 或者
diskusage
```

或者到[release](https://github.com/changero/nusage/releases)页面下载对应平台的包

## 开发

```bash
yarn

yarn dev

node bin/nusage
```

### 关于 nexe 的说明

如果本地要执行 release，请注意在[nexe release](https://github.com/nexe/nexe/releases/tag/v3.3.3)页面下载对应版本的包，放到`用户目录/.nexe`目录中
