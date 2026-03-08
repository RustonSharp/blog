---
title: 数字简约的架构
date: 2023年10月24日
category: 设计
excerpt: 探索剥离非本质元素如何让我们与每天使用的工具建立更深层次的联系。为什么简单往往能带来更有意义的工作。
heroImage: https://lh3.googleusercontent.com/aida-public/AB6AXuA7-SuOa1TtEEcLF4vubfoUqMq76FPpB673dOPY1eef843EJXeLVoOEEfGHuUDc0O4sNiYQzQIfdbAZIeFIMEFeqxZ4RY13ftX7a7KEp5bbs22BHncfOJWV2BcGJmUHKKOOLYw1BK8bsU0_MqTeAOo8Rz1fSYog7O2x2haebbSrYNbCQrHzCwlbD-XLbE0a3O7PPbFy2G5ne4UcBGgJhUW9lRSeBXjPucBd74ln5nGoO5hfmtQCvKxvz-jDQpCUZtiqLy5uYQxX_P4
---

## 核心哲学

简约不是杂乱的缺失，那是简约的结果。简约在某种程度上本质上描述了物体和产品的用途和位置。没有杂乱只是通往那种简约的一个线索。

在数字架构中，我们经常将`极简主义`误认为`简约`。虽然它们共享共同的基因，**极简主义是一种审美选择，而简约是一种功能成就**。要实现真正的简约，必须了解表象之下所做的繁重工作。

> “好的设计是尽可能少的设计。少，但更好——因为它专注于核心方面，产品不会被非核心的事物所累。” — 迪特·拉姆斯

### 实现网格

当我们审视现代框架时，代码的结构应该反映出输出的视觉简约性。考虑这个干净的 Flex 容器的标准实现：

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-unit);
  max-width: 1200px;
  margin: 0 auto;
}
```

目标是减轻用户的认知负荷。每一个额外的按钮、每一行多余的文字、每一个不必要的动画都会产生摩擦。在简约的架构中，我们将用户的注意力视为有限且宝贵的资源。

- **减少** 选项到核心路径。
- **分组** 视觉上对相关元素进行分组，以建立心理模型。
- **隐藏** 高级功能，采用有意的揭示方式。
