 

# GitHub Contributions API

部署在 [Vercel](https://vercel.com/) 上的 GitHub Contributions API, 同時支援 SVG 和 JSON 格式的返回數據.

---

## 1. 部署

1.1. Fork 此項目, 在 Vercel DashBoard 上進行操作: Add New > Project > Import Git Repository > Import 你剛纔 Fork 的此項目.

1.2. 建議綁定域名, Vercel 提供的公共 *.vercel.app 域名在部分國家和地區訪問受阻.

## 2. 使用

### 2.1. JSON 格式

可訪問如下 URL `https://<Your Project Domain>/api/get?username=<A User's ID>&type=json` 獲取 JSON 格式的數據.

#### 2.1.1 JSON 數據結構

- `Username` 此用戶的 Github ID.
- `Total` 此用戶在最近一年中的累積 Contribution 數量.
- `GenAt` 此次結果生成於何時 (UTC 時間).
- `Contributions` 一般是長度爲 53 的數組, 每一個子數組代表一週, 每一個子數組的子對象代表一天, 在這裏面又有分爲 `Date`, `Level`, `Contributions` 分別表示這天的 日期(YYYY-MM-DD), 提交等級(0~5), 提交次數.

### 2.2. SVG 格式

可訪問如下 URL `https://<Your Project Domain>/api/get?username=<A User's ID>&type=svg` 獲取 SVG 格式的數據. 下圖爲示例.

![](https://github-contributions-api-lac.vercel.app/api/get?username=kobe-koto&type=svg)

#### 2.2.1 自訂 SVG 格式

目前有下列參數可供使用

- TextColor 文字的顏色

- BackgroundColor 背景顏色

- RectColors 各等級統計色塊的顏色

  共 5 個 Hex 值(5 個等級), 請用英文逗號分割.

以上提到的顏色均使用 Hex 值, 沒有開頭的 `#`.

例子:

```text
https://<Your Project Domain>/api/get?
username=<A User's ID>
&type=svg
&TextColor=1f1f1f
&BackgroundColor=f8f8ff
&RectColors=f3dee6,e3b4c5,cc7494,c0547b,b12a5b
```

返回示例:

![](https://github-contributions-api-lac.vercel.app/api/get?username=kobe-koto&type=svg&TextColor=1f1f1f&BackgroundColor=f8f8ff&RectColors=f3dee6,e3b4c5,cc7494,c0547b,b12a5b)

---

#### 感謝您的閱讀和使用, 不介意的話請給個 Star 吧!

