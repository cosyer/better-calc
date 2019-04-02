## 摘要
js浮点数计算会出现精度问题。
```
0.1 + 0.2 = 0.30000000000000004
19.9 * 100 = 1989.9999999999998
```
toFixed()方法和先乘计算后除都是会有问题。

在 JavaScript 中所有数值都以 IEEE-754 标准的 64 bit 双精度浮点数进行存储的。

浮点数在计算机中是以二进制来存储的。对于整数，可用公比为2的等比数列求和公式来计算，对于小数公比则为1/2。n为数的位数。
```
Sn = (a1 - a1 * Math.pow(q, n + 1)) / (1 - q);
```
根据上述公式，公比为2时，Sn可表示任意整数。
```
Sn = (a1 * (Math.pow(2, n + 1) - 1));
```
根据上述公式，公比为1/2时，n为有限值时，Sn无法表示任意小数，即存在无限小数。而计算机能表示的精度是有限的，必然存在误差。
```
Sn = (a1 * (2 - Math.pow(2, -n)));
```

如0.1等小数不能完美地用二进制表示，能被转化为有限二进制小数的十进制小数的最后一位必然以 5 结尾(因为只有 0.5 * 2 才能变为整数)。所以十进制中一位小数 0.1 ~ 0.9 当中除了 0.5 之外的值在转化成二进制的过程中都丢失了精度。
```js
0.1×2=0.2 .....................0

0.2×2=0.4 .....................0

0.4×2=0.8 .....................0

0.8×2=1.6 .....................1

0.6×2=1.2 .....................1

0.2×2=0.4 .....................0 无限循环
```
## 解决原理
在最大值范围内，整数计算是不存在误差的，因此`better-calc`就是将所有的浮点数转换成整数来计算，切记不能通过乘以10的倍数来转换，而是要通过字符串的replace方法将'.'替换成''。

* 加法：加数和被加数同时放大10的m次方倍，相加，再除以10的m次方倍
* 减法：相当于加上一个负数，跟加法一样。
* 乘法：乘数和被乘数同时放大10的m次方倍，相乘，再除以10的2m次方倍
* 除法：乘数和被乘数同时放大10的m次方倍，相除

## 缺点
js能取值范围如下，由于采用了放大倍数的方法，因此会对整体的取值范围有影响（最大/最小安全值）。
```
±Math.pow(2, 53) = ±9007199254740991 // Number.MAX_SAFE_INTEGER和Number.MIN_SAFE_INTEGER
```

## 引入方式
1. `better-calc`支持script标签引入，挂载在全局的window.Calc变量下。
```js
<script type="text/javascript" src="./index.js"></script>
```
2. **npm 安装**
```js
npm install better-calc -S
```

[![](https://img.shields.io/npm/v/better-calc.svg?style=flat)](https://npmjs.com/package/better-calc)
[![](https://img.shields.io/npm/dm/better-calc.svg?style=flat)](https://npmjs.com/package/better-calc)
[![](https://img.shields.io/bundlephobia/minzip/better-calc.svg?style=flat)](https://bundlephobia.com/result?p=better-calc)

通过es6的import语法
```js
import Calc from 'better-calc';
```

通过commonjs规范引入
```js
const Calc =  require('better-calc');
```

## 使用方法
Calc提供了四个方法，分别对应加减乘除方法。
```js
Calc.add(a, b);
Calc.sub(a, b);
Calc.mul(a, b);
Calc.div(a, b);
```

## 业内常用解决方案

1.针对大数的整数可以考虑使用 bigint 类型(目前在 stage 3 阶段)；

2.使用 [bigNumber](https://github.com/MikeMcl/bignumber.js)，它的思想是转化成 string 进行处理，这种方式对性能有一定影响；

3.可以考虑使用 [long.js](https://github.com/dcodeIO/long.js)，它的思想是将 long 类型的值转化成两个精度为 32 位的双精度类型的值;

4.针对小数的话可以使用 [number-precision](https://github.com/nefe/number-precision), 该库将小数转为整数后再作处理；

## 推荐阅读
[JavaScript 浮点数陷阱及解法](https://github.com/camsong/blog/issues/9)