import { Equal, Equal2, Expect } from './type-utils/utils';

// typeof : 변수나 프로퍼티의 타입을 추론해준다.
// 1. ReturnType<T extends (...args:any) => any> :  함수형 타입의 리턴값을 뽑아준다

type CustomReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;

const fnHello = (): string => {
  return 'hello';
};

type FnHelloReturn = CustomReturnType<typeof fnHello>;
type Test_1 = Expect<Equal<FnHelloReturn, string>>;

// 2. Parameters<T extends (...args:any) => any> : 함수형 타입의 파라미터를 뽑아준다

type CustomParameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;

const fnFetch = (
  url: string,
  opts?: {
    method?: string;
    headers?: {
      [key: string]: string;
    };
    body?: string;
  }
) => {};
type FnFetchParameter = CustomParameters<typeof fnFetch>;
type Test_2 = Expect<
  Equal<
    FnFetchParameter,
    [
      url: string,
      opts?: {
        method?: string;
        headers?: {
          [key: string]: string;
        };
        body?: string;
      }
    ]
  >
>;

// typescript 4.5 추가  https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html
// 3. Awaited<T> = Promise로 감싸져 있는 타입의 래핑을 해제해준다.
// ex. Awaited<string | Promise<number>> => string | number

type CustomAwaited<T> = T extends null | undefined
  ? T // 만약 들어온 타입이 null 또는 undefined라면 그대로 반환
  : T extends object & { then: (onfulfilled: infer F, ...args: infer _) => any } // 그게 아니라면 Promise 객체인지 체크(then 메소드를 가지는지)
  ? F extends (value: infer V) => any // 만약 Promise객체라면 onfulfilled의 타입은 (value: 리턴타입V) => any 형태임
    ? CustomAwaited<V> // 재귀적으로 Promise를 해제 (프로미스 객체의 리턴타입으로 재귀반복)
    : never // onfulfilled의 타입이 올바르지 않다면 never
  : T; // 만약 Promise객체가 아닐경우 일반 리턴타입임으로 그대로 반환

const getMe = () => {
  return Promise.resolve({
    id: '3145',
    name: 'Woo',
    email: 'woo3145@example.com',
  });
};

type ReturnValue = CustomAwaited<ReturnType<typeof getMe>>;
type Test_3 = Expect<
  Equal<ReturnValue, { id: string; name: string; email: string }>
>;

// 4. keyof : 타입에서 키값 뽑기

const animal = {
  dog: '',
  cat: '',
  panda: '',
  tiger: '',
};

type AnimalKeys = keyof typeof animal;
type Test_4 = Expect<Equal<AnimalKeys, 'dog' | 'cat' | 'panda' | 'tiger'>>;
