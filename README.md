# 海外华语脱口秀俱乐部官网

海外华语脱口秀俱乐部的响应式单页官网，使用原生 HTML、CSS 和 JavaScript 构建，可直接部署到 GitHub Pages。

## 本地预览

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 添加照片

目前页面中的主视觉、演出海报、活动照片和创始人照片均为占位内容。后续可将照片放入 `assets/images/`，再用 `<img>` 替换 `index.html` 中对应的 `.photo-placeholder` 容器。

## 发布

在仓库的 **Settings → Pages → Build and deployment** 中选择 **Deploy from a branch**，然后将分支设为 `main`、目录设为 `/(root)` 并保存。之后每次推送到 `main` 分支都会自动更新网站。
