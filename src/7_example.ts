// 응용 예시
// 1.path에서 dynamic path 추출

import { Equal, Expect } from './type-utils/utils';

type UserPath = '/user/:id';
type UserItemPath = '/user/:id/items/:itemId';

type Split<
  S extends string,
  D extends string
> = S extends `${infer T}${D}${infer U}`
  ? T extends '' // 빈 문자열이 있으면 제거
    ? [...Split<U, D>]
    : [T, ...Split<U, D>]
  : [S];

type DynamicPath<S extends string> = {
  [K in Split<S, '/'>[number] as K extends `:${infer Key}`
    ? Key
    : never]: string;
};

type Test_1 = Expect<Equal<DynamicPath<UserPath>, { id: string }>>;
type Test_2 = Expect<
  Equal<DynamicPath<UserItemPath>, { id: string; itemId: string }>
>;

// 2. Deep Partial

type DeepType = {
  a: string;
  b: boolean;
  c: {
    d: number[];
    e: string;
    f: string[];
    g: {
      h: boolean;
      i: string;
    }[];
  };
};

type DeepPartial<T> = T extends Array<infer U>
  ? Array<DeepPartial<U>> // 배열일 경우 반환타입을 배열로 감싼 뒤 재귀실행
  : { [K in keyof T]?: DeepPartial<T[K]> }; // 객체일 경우 각 프로퍼티 키를 optional로 만든 후 재귀적으로 타입추론

type Test_3 = Expect<
  Equal<
    DeepPartial<DeepType>,
    {
      a?: string;
      b?: boolean;
      c?: {
        d?: number[];
        e?: string;
        f?: string[];
        g?: {
          h?: boolean;
          i?: string;
        }[];
      };
    }
  >
>;
// 만약 DeepPartial<number>와 같이 기본타입이 들어갈때 재귀 호출에 빠져 타입에러가 예상되었지만 의외로 잘 작동해서 찾아보았다.

// Typescript는 이전에도 위와같은 mapped keys에 대한 재귀호출을 사용할 수 있었다.
// (컴파일러 내부동작이라 재귀로 판단하면 첫 type을 반환하는지 keyof T로 [never]: 재귀<T>가 되면 T를 반환하는지는 잘 모르겠다)

// 하지만 조건부 타입에 대한 재귀호출은 제한했는데 Typescript 4.1이후 조건부 타입에 대한 재귀호출을 완화한듯 하다.
// https://github.com/microsoft/TypeScript/pull/40002
// 요약하면 예전에는 조건부 타입의 재귀호출을 명시적으로 제한하여 여러 트릭으로 우회하여 재귀호출을 하는 보편적인 트릭이 존재했지만
// 번거롭다고 여겨 4.1부터 컴파일러를 강화해서 재귀 조건부 타입에 대한 제한을 완화 하게되었다.

type DeepArray<T> = T extends Array<infer U> ? DeepArray<U> : T;
// 4.1 이전 : 순환참조 Error 발생
// 4.1 이후 현재 : string으로 값 추론

type TestDeepArray = DeepArray<Array<Array<string>>>;
// *** 제약조건중 깊이 제한자가 존재하기 때문에 복잡한 타입을 추론하면 컴파일 시간이 증가할 뿐더러 깊이제한에 도달한다면 컴파일 에러가 발생한다.
// *** 따라서 이러한 타입은 강력하지만 책임감을 가지고 남발하면 안된다.
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#recursive-conditional-types
