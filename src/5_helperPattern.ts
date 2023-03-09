import { Equal, Expect } from './type-utils/utils';

// 1. Maybe

type Maybe<T> = T | null | undefined;

type MaybeString = Maybe<string>;
type Test_1 = Expect<Equal<MaybeString, string | null | undefined>>;

// + Maybe에서 T에 null, undefined 제한
// https://stackoverflow.com/questions/62552915/significance-of-extends 참고
// 요약 : <T>는 <T extends unknown>으로 작동하지만 <T extends {}> 는 null or undefined를 제외시킬 수 있다.

type EnhancedMaybe<T extends {}> = T | null | undefined;

// @ts-expect-error
type ErrorType_1 = EnhancedMaybe<null>; // 에러

// 2. Constraint

type AddRoutePrefix<T extends string> = T extends `${infer P}${string}`
  ? P extends '/'
    ? T
    : `/${T}`
  : '/';

type Test_2 = Expect<Equal<AddRoutePrefix<'home'>, '/home'>>;
type Test_3 = Expect<Equal<AddRoutePrefix<'/home'>, '/home'>>;
type Test_4 = Expect<Equal<AddRoutePrefix<''>, '/'>>;

// 3. Template

type CreateDataType<T, U = undefined> = {
  data: T;
  error: U;
};

type Test_5 = Expect<
  Equal<
    CreateDataType<boolean, SyntaxError>,
    { data: boolean; error: SyntaxError }
  >
>;
type Test_6 = Expect<
  Equal<CreateDataType<string>, { data: string; error: undefined }>
>;

// 4. Function Constraint

type GetParamsAndReturnType<T extends (...args: any) => any> = {
  params: Parameters<T>;
  returnValue: ReturnType<T>;
};

type Test_7 = Expect<
  Equal<
    GetParamsAndReturnType<(str: string, num: number) => boolean>,
    { params: [string, number]; returnValue: boolean }
  >
>;

// 5. NonEmpty Array
// 타입스크립트에서 빈배열을 전개하면 에러가 발생하는점을 이용하여 만든 NonEmptyArray 타입

type NonEmptyArray<T> = [T, ...T[]];

const arrA: NonEmptyArray<string> = [''];
// @ts-expect-error
const arrB: NonEmptyArray<any> = []; // 에러발생
