// Union 과 Discriminated Union

import { Equal, Expect } from './type-utils/utils';

// union type
type UnionType = 'a' | 'b' | 'c';

// Discriminated union

type NetworkLoadingState = {
  state: 'loading';
};
type NetworkFailedState = {
  state: 'failed';
  code: number;
};
type NetworkSuccessState = {
  state: 'success';
  response: {
    title: string;
    duration: number;
    summary: string;
  };
};

type NetworkState =
  | NetworkLoadingState
  | NetworkFailedState
  | NetworkSuccessState;

// Discriminated union 은 위예시처럼 공유 필드가 있는 타입을 묶어두어
// 런타임에서 유형의 범위를 좁힐 수 있다.
// ex. api 요청에서 리턴타입을 명확하게 지정하여 공유 필드값에 따라 타입을 명확하게 나눌 수 있다.

// Extract<T, U> : T타입에서 U타입에 할당 가능한 타입을 반환한다

type CustomExtract<T, U> = T extends U ? T : never;

type ExtracedNetworkSuccessState = CustomExtract<
  NetworkState,
  { state: 'success' }
>;

type Test_1 = Expect<Equal<ExtracedNetworkSuccessState, NetworkSuccessState>>;

// Exclude<T, U> : T타입에서 U타입에 할당 가능한 타입을 제외한다

type SuccessExcludedNetworkState = Exclude<NetworkState, NetworkSuccessState>;

type Test_2 = Expect<
  Equal<SuccessExcludedNetworkState, NetworkLoadingState | NetworkFailedState>
>;
