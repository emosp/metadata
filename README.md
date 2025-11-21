# metadata

适用于 `emya` 的媒体信息抓取

# 所需扩展

- `ffprobe` 扫码视频信息用到

# Api

## `ffprobe`

```bash
curl --location '127.0.0.1:8000/ffprobe' --header 'Content-Type: application/json' --data '{
    "url": "[file_url]"
}'
```
