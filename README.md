# @mudbean/log

[![version](<https://img.shields.io/npm/v/log.svg?logo=@mudbean/npm&logoColor=rgb(0,0,0)&label=版本号&labelColor=rgb(73,73,228)&color=rgb(0,0,0)>)](https://www.npmjs.com/package/@mudbean/log) [![issues 提交](<https://img.shields.io/badge/issues-提交-rgb(255,0,63)?logo=github>)](https://github.com/MrMudBean/log/issues)

## 安装

```bash
npm install --save @mudbean/log
```

## 使用 Dog

### 创建全局的 `dog` (dev log 的缩写，天才第一步，起名要认真) 对象

```ts
/// 这里假设以 `a node tools` 为 `name` 的值
export const dog = new Dog({ name: 'a node tools' });
```

### 在需要打印日志的地方引入 `dog` 对象

```ts
import { dog } from './dog';

dog('你好'); // 该值是否打印还依赖于环境变量中有没有配置 `dev_log_dev` 的值
```

### 启用配置

```bash
# 配置 name 为 'a node tools'，则使用 `a_node_tools_dev` 或 `A_NODE_TOOLS_DEV` 来启动
a_node_tools_dev=true npm run dev
```

### 折叠同名方法打印消息

使用 `fold` 参数 :

```js
import { Dog } from '@mudbean/log';

const dog = Dog();
```

## 状态

此软件包是 `@mudbean` 生态系统的一部分。
它使用严格的 TypeScript 编写，并通过 Rollup 构建进行验证。
虽然单元测试较少，但 API 稳定，并在生产环境中大量使用。
