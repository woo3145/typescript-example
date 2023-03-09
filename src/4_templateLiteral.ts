// template literal types: string literal types를 기반으로 만들어진 새로운 타입

import { Equal, Expect } from './type-utils/utils';

// 1. 기본적인 형태
type Route = `/${string}`;

const goToRoute = (route: Route) => null;

// @ts-expect-error
goToRoute('dashboard');
goToRoute('/dashboard');

// 1_1. 추출

type AnyRoutes = '/home' | 'blog' | '/my' | '/404' | 'login';
type ValidRoute = Extract<AnyRoutes, Route>;

type Test_1 = Expect<Equal<ValidRoute, '/home' | '/my' | '/404'>>;

// 2. Union Type

type FirstName = '준' | '현';
type LastName = '이' | '김';
type KrName = `${LastName} ${FirstName}`;

type Test_2 = Expect<Equal<KrName, '이 준' | '이 현' | '김 준' | '김 현'>>;

// 3. 타입 분해
type Path = '/Usr/home/image/image.png';

type Split<
  S extends string,
  D extends string
> = S extends `${infer T}${D}${infer U}` ? [T, ...Split<U, D>] : [S];

type FilterFirst<T extends unknown> = T extends [unknown, ...infer R] ? R : []; // 임시

type SplitPath = FilterFirst<Split<Path, '/'>>;

type Test_3 = Expect<Equal<SplitPath, ['Usr', 'home', 'image', 'image.png']>>;

// 4. 내장 지원타입

// 4-1. Uppercase<T extends string> , Lowercase<T extends string>

type Hello = 'Hello';

type UpperHello = Uppercase<Hello>;
type LowerHello = Lowercase<Hello>;

type Test_4 = Expect<Equal<UpperHello, 'HELLO'>>;
type Test_5 = Expect<Equal<LowerHello, 'hello'>>;

// 4_2. Capitalize<T extends string>, Uncapitalize<T extends string>

type CapitalizeHello = Capitalize<Lowercase<Hello>>;
type UncapitalizeHello = Uncapitalize<Hello>;

type Test_6 = Expect<Equal<CapitalizeHello, 'Hello'>>;
type Test_7 = Expect<Equal<UncapitalizeHello, 'hello'>>;
