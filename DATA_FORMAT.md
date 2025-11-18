# 租屋数据格式规范

## 概述
此文档定义了从 Facebook 租屋社团抓取的原始数据（raw text）清洗后的标准化 JSON 格式。

---

## 文件格式

### 文件名称
`rentals.json`

### 文件位置
`/rental-website/public/data/rentals.json`

### 文件结构
```json
[
  {
    // 租屋物件 1
  },
  {
    // 租屋物件 2
  }
]
```

**重要**：文件是一个数组，包含多个租屋物件对象。

---

## 数据字段规范

### 1. 顶层必填字段

| 字段名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| `id` | string | ✅ | 唯一标识符，格式：YYYY-MM-DD-XXX | `"2025-11-14-001"` |
| `district` | string | ✅ | 行政区，格式：XX市XX区 | `"台北市南港區"` |
| `housing_type` | string | ✅ | 房型 | `"獨立套房"` |
| `rent_price` | number | ✅ | 月租金（新台币） | `18800` |
| `title` | string | ✅ | 物件标题/摘要 | `"距離捷運站1分鐘、附家具"` |
| `summary_notes` | array | ✅ | 重要提醒/警告（可为空数组） | `[]` 或 `["價格可能不含管理費"]` |
| `details` | object | ✅ | 详细信息对象 | 见下方 |
| `post_date` | string | ✅ | 发布日期，格式：YYYY-MM-DD | `"2025-11-14"` |
| `source_url` | string | ✅ | Facebook 原始链接 | `"https://www.facebook.com/..."` |

---

### 2. `housing_type` 允许值

**只能使用以下四个值之一**：
- `"雅房"`
- `"分租套房"`
- `"獨立套房"`
- `"雅套混合"`

---

### 3. `summary_notes` 字段说明

**类型**: `string[]` (字符串数组)

**用途**: 存储从原始文本中提取的重要提醒或警告信息

**规则**:
- 如果没有警告信息，使用空数组 `[]`
- 每条提醒应该简洁明了（建议 ≤ 30 字）
- 常见提醒类型：
  - 价格相关：`"價格可能不含管理費"`、`"押金兩個月"`
  - 限制条件：`"不可養寵物"`、`"限女性"`
  - 冲突信息：`"標題與內文坪數不一致"`

**示例**:
```json
"summary_notes": []
```
```json
"summary_notes": ["價格可能不含管理費", "限女性"]
```

---

### 4. `details` 对象结构

```typescript
{
  "address": string | null,
  "layout_info": {
    "room_size": string | null,
    "overall_layout": string | null,
    "floor_info": string | null
  },
  "rights": string,
  "cost_notes": string[],
  "facilities": string[],
  "restrictions": string[]
}
```

#### 4.1 `details.address`
- **类型**: `string | null`
- **说明**: 详细地址
- **规则**:
  - 如果原文提供了具体地址，填入完整地址
  - 如果未提供，使用 `null`
- **示例**:
  - `"台北市南港區南港路一段123號"`
  - `null`

#### 4.2 `details.layout_info`
格局信息对象，包含三个子字段：

##### `room_size` (房间配置)
- **类型**: `string | null`
- **格式**: `"X房X衛"` 或 `"X房X廳X衛"`
- **示例**:
  - `"1房1衛"`
  - `"2房1廳1衛"`
  - `"4房2衛"`
  - `null` (未提供)

##### `overall_layout` (整体格局)
- **类型**: `string | null`
- **说明**: 整层或整间的格局描述
- **示例**:
  - `"整層出租 3房2廳2衛"`
  - `null`

##### `floor_info` (楼层信息)
- **类型**: `string | null`
- **示例**:
  - `"5樓"`
  - `"3樓/共7樓"`
  - `null`

#### 4.3 `details.rights`
- **类型**: `string`
- **说明**: 租客权利（租补、报税等）
- **允许值**:
  - `"可租補"` - 可申请租金补贴
  - `"可報稅"` - 可报税
  - `"可租補、可報稅"` - 两者皆可
  - `"未說明"` - 原文未说明
- **默认值**: `"未說明"`

#### 4.4 `details.cost_notes`
- **类型**: `string[]` (字符串数组)
- **说明**: 费用相关说明
- **常见内容**:
  - `"電費：台電計費"`
  - `"電費：每度5元"`
  - `"水費：每月500元"`
  - `"管理費：每月1000元"`
  - `"網路費：每月300元"`
- **规则**: 如果没有费用说明，使用空数组 `[]`

#### 4.5 `details.facilities`
- **类型**: `string[]` (字符串数组)
- **说明**: 设施与设备
- **常见内容**:
  - `"冷氣"`
  - `"洗衣機"`
  - `"冰箱"`
  - `"電視"`
  - `"熱水器"`
  - `"網路"`
  - `"第四台"`
  - `"電梯"`
  - `"陽台"`
  - `"車位"`
  - `"附家具"`
- **规则**: 如果没有提及设施，使用空数组 `[]`

#### 4.6 `details.restrictions`
- **类型**: `string[]` (字符串数组)
- **说明**: 限制条件
- **常见内容**:
  - `"限女性"`
  - `"限男性"`
  - `"不可養寵物"`
  - `"不可開伙"`
  - `"禁止吸菸"`
  - `"限學生"`
  - `"限上班族"`
- **规则**: 如果没有限制，使用空数组 `[]`

---

## 完整示例

### 示例 1：信息完整的物件

```json
{
  "id": "2025-11-14-001",
  "district": "台北市南港區",
  "housing_type": "獨立套房",
  "rent_price": 18800,
  "title": "距離文湖線＋板南線雙捷交會首站僅1分鐘、步行30公尺即達雙捷交會「南港展覽館站」、附家具",
  "summary_notes": [],
  "details": {
    "address": "台北市南港區經貿二路188號",
    "layout_info": {
      "room_size": "1房1衛",
      "overall_layout": null,
      "floor_info": "8樓"
    },
    "rights": "可租補",
    "cost_notes": [
      "電費：台電計費",
      "水費：每月500元",
      "管理費：每月1500元"
    ],
    "facilities": [
      "冷氣",
      "洗衣機",
      "冰箱",
      "熱水器",
      "網路",
      "電梯",
      "附家具"
    ],
    "restrictions": [
      "不可養寵物"
    ]
  },
  "post_date": "2025-11-14",
  "source_url": "https://www.facebook.com/commerce/listing/1374285981079795/?ref=share_attachment"
}
```

### 示例 2：信息不完整的物件

```json
{
  "id": "2025-11-14-002",
  "district": "台北市松山區",
  "housing_type": "雅房",
  "rent_price": 12800,
  "title": "步行6分鐘到南京三民捷運站、有電梯、有陽台",
  "summary_notes": [],
  "details": {
    "address": null,
    "layout_info": {
      "room_size": "4房2衛",
      "overall_layout": null,
      "floor_info": null
    },
    "rights": "可租補",
    "cost_notes": [
      "電費：台電計費"
    ],
    "facilities": [
      "電梯",
      "陽台"
    ],
    "restrictions": []
  },
  "post_date": "2025-11-14",
  "source_url": "https://www.facebook.com/commerce/listing/1809309009696439/?ref=share_attachment"
}
```

### 示例 3：有警告信息的物件

```json
{
  "id": "2025-11-14-003",
  "district": "新北市中和區",
  "housing_type": "獨立套房",
  "rent_price": 28000,
  "title": "有陽台、獨立廚房、瓦斯",
  "summary_notes": [
    "價格可能不含管理費",
    "標題與內文坪數不一致"
  ],
  "details": {
    "address": null,
    "layout_info": {
      "room_size": "2房",
      "overall_layout": null,
      "floor_info": null
    },
    "rights": "未說明",
    "cost_notes": [
      "電費：台電計費"
    ],
    "facilities": [
      "陽台",
      "獨立廚房",
      "瓦斯"
    ],
    "restrictions": []
  },
  "post_date": "2025-11-14",
  "source_url": "https://www.facebook.com/commerce/listing/1386704826405270/?ref=share_attachment"
}
```

---

## 数据验证规则

### 必须验证的规则：

1. **ID 唯一性**: 每个 `id` 必须唯一
2. **日期格式**: `post_date` 必须是 `YYYY-MM-DD` 格式
3. **房型限制**: `housing_type` 只能是四个允许值之一
4. **租金正数**: `rent_price` 必须是正整数
5. **URL 格式**: `source_url` 必须是有效的 Facebook URL
6. **区域格式**: `district` 必须包含"市"和"區"
7. **数组类型**: 所有数组字段即使为空也必须是 `[]`，不能是 `null`

---

## 数据提取优先级

从 Facebook 原始文本提取信息时的优先级：

### 高优先级（必须提取）
1. 区域 (`district`)
2. 房型 (`housing_type`)
3. 租金 (`rent_price`)
4. 发布日期 (`post_date`)
5. 来源链接 (`source_url`)

### 中优先级（尽量提取）
6. 标题 (`title`)
7. 格局信息 (`layout_info`)
8. 费用说明 (`cost_notes`)
9. 设施 (`facilities`)

### 低优先级（有则提取）
10. 详细地址 (`address`)
11. 权利说明 (`rights`)
12. 限制条件 (`restrictions`)
13. 警告信息 (`summary_notes`)

---

## 常见问题处理

### Q1: 原文没有明确说明房型怎么办？
**A**: 根据以下规则推断：
- 提到"整层"、"独立卫浴"、"独立厨房" → `"獨立套房"`
- 提到"分租"、"套房" → `"分租套房"`
- 提到"雅房"、"共用卫浴" → `"雅房"`
- 同时有雅房和套房 → `"雅套混合"`
- 完全无法判断 → 设为 `"分租套房"` (最常见类型)

### Q2: 租金有多个价格怎么办？
**A**: 使用最低价格，并在 `summary_notes` 中添加说明：
```json
"rent_price": 12000,
"summary_notes": ["雅房12000元，套房15000元"]
```

### Q3: 地址信息模糊怎么办？
**A**:
- 只有路名没有门牌 → 填入路名，如 `"台北市中正區羅斯福路"`
- 只有地标 → 填入地标，如 `"捷運公館站附近"`
- 完全没有 → 使用 `null`

### Q4: 如何处理冲突信息？
**A**:
- 将冲突描述添加到 `summary_notes`
- 数据字段使用较保守的值（例如价格用较高的，面积用较小的）

---

## 输出文件示例

**文件路径**: `public/data/rentals.json`

```json
[
  {
    "id": "2025-11-14-001",
    "district": "台北市南港區",
    "housing_type": "獨立套房",
    "rent_price": 18800,
    "title": "距離文湖線＋板南線雙捷交會首站僅1分鐘、步行30公尺即達雙捷交會「南港展覽館站」、附家具",
    "summary_notes": [],
    "details": {
      "address": null,
      "layout_info": {
        "room_size": "1房1衛",
        "overall_layout": null,
        "floor_info": null
      },
      "rights": "未說明",
      "cost_notes": [
        "電費：台電計費"
      ],
      "facilities": [],
      "restrictions": []
    },
    "post_date": "2025-11-14",
    "source_url": "https://www.facebook.com/commerce/listing/1374285981079795/?ref=share_attachment"
  }
]
```

---

## 部署流程

### 步骤 1: Gemini CLI 数据清洗
使用 Gemini CLI 按照此规范清洗 raw text 数据，生成 `rentals.json`

### 步骤 2: 验证数据格式
确保 JSON 格式正确，所有必填字段都存在

### 步骤 3: 更新文件
将 `rentals.json` 放到项目的 `public/data/rentals.json`

### 步骤 4: 提交到 GitHub
```bash
cd rental-website
git add public/data/rentals.json
git commit -m "更新租屋数据 - $(date +%Y-%m-%d)"
git push origin main
```

### 步骤 5: 重新部署
```bash
npm run build
npm run deploy
```

---

## 联系方式

如有数据格式相关问题，请通过以下方式联系：
- Threads: [@housemate_tw](https://www.threads.com/@housemate_tw)

---

**文档版本**: 1.0.0
**最后更新**: 2025-11-17
