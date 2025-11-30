# metadata

适用于 [`emya`](https://github.com/emosp/emya) 的媒体信息抓取

# 安装

## pm2

### 所需扩展

- `ffprobe` 扫码视频信息用到

### 使用

```bash
pnpm install
pnpm run build
pm2 start
```

## docker

`docker build . -t emospg/metadata`

```bash
docker compose up -d
```

# Api

## `ffprobe`

```bash
curl --location '127.0.0.1:8000/ffprobe' --header 'Content-Type: application/json' --data '{
    "url": "[file_url]"
}'
```
