// 1. Indexed access types
// 어떤 타입에서 Indexed access types을 이용하여 특정 프로퍼티의 타입을 찾을 수 있음

import { Equal, Expect } from './type-utils/utils';

const defaultData = {
  string: 'String',
  number: 1.4,
  boolean: true,
};

type DefaultDataTypes = typeof defaultData;

type StringType = DefaultDataTypes['string'];
type NumberType = DefaultDataTypes['number'];
type BooleanType = DefaultDataTypes['boolean'];

type Test_1 = Expect<Equal<StringType, string>>;
type Test_2 = Expect<Equal<NumberType, number>>;
type Test_3 = Expect<Equal<BooleanType, boolean>>;

// indexing type 자체가 타입이기때문에 unions, keyof, other types을 사용할 수 있음

type T1 = DefaultDataTypes['string' | 'number'];
type T2 = DefaultDataTypes[keyof DefaultDataTypes];
type OtherT = 'string' | 'number';
type T3 = DefaultDataTypes[OtherT];

type Test_4 = Expect<Equal<T1, string | number>>;
type Test_5 = Expect<Equal<T2, string | number | boolean>>;
type Test_6 = Expect<Equal<T3, string | number>>;

// 2. Discriminated unions 에서 Discriminator 뽑기

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

type NetworkStateType = NetworkState['state'];

type Test_7 = Expect<Equal<NetworkStateType, 'loading' | 'failed' | 'success'>>;

// 3. Enum 대신 as const

// 3_1. Typescript에서 Enum을 사용하면 Tree-shaking(안쓰는 코드를 삭제하는 기능)이 일어나지 않는다.
// 참고 https://engineering.linecorp.com/ko/blog/typescript-enum-tree-shaking/

// 3_2. Enum끼리 값 비교 불가
enum Direction1 {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right',
}

enum Direction2 {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right',
}
// Direction1.Up === Direction2.Up; 아래 애러발생
// This comparison appears to be unintentional because the types 'Direction1' and 'Direction2' have no overlap.ts(2367)

const DirectionEnumMap = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
} as const;

type Up = typeof DirectionEnumMap['UP'];
type Down = typeof DirectionEnumMap['DOWN'];
type Left = typeof DirectionEnumMap['LEFT'];
type Right = typeof DirectionEnumMap['RIGHT'];

type Test_8 = Expect<Equal<Up, 'up'>>;
type Test_9 = Expect<Equal<Down, 'down'>>;
type Test_10 = Expect<Equal<Left, 'left'>>;
type Test_11 = Expect<Equal<Right, 'right'>>;

// 물론 Indexed access 가능

type UpOrDown1 = typeof DirectionEnumMap['UP' | 'DOWN'];
type UpOrDown2 = typeof DirectionEnumMap[Exclude<
  keyof typeof DirectionEnumMap,
  'LEFT' | 'RIGHT'
>];

type Test_12 = Expect<Equal<UpOrDown1, 'up' | 'down'>>;
type Test_13 = Expect<Equal<UpOrDown2, 'up' | 'down'>>;

// 4. object, array에서 value 뽑기 (as const)

type DirectionValue = typeof DirectionEnumMap[keyof typeof DirectionEnumMap];
type Test_14 = Expect<Equal<DirectionValue, 'up' | 'down' | 'right' | 'left'>>;

const directionArray = ['up', 'down', 'left', 'right'] as const;
type DirectionArrayValue1 = typeof directionArray[0 | 1];
type DirectionArrayValue2 = typeof directionArray[number];

type Test_15 = Expect<Equal<DirectionArrayValue1, 'up' | 'down'>>;
type Test_16 = Expect<
  Equal<DirectionArrayValue2, 'up' | 'down' | 'right' | 'left'>
>;
