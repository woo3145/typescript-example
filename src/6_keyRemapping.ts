// 1. union

import { Equal, Expect } from './type-utils/utils';

type Routes = '/' | '/home' | '/my' | '/my/item';

type RoutesObj = {
  [K in Routes]: K;
};

type Test_1 = Expect<
  Equal<
    RoutesObj,
    {
      '/': '/';
      '/home': '/home';
      '/my': '/my';
      '/my/item': '/my/item';
    }
  >
>;

// 2. interface

interface User {
  name: string;
  age: number;
}

type UserGetters1 = {
  [T in keyof User]: () => User[T];
};

type Test_2 = Expect<
  Equal<UserGetters1, { name: () => string; age: () => number }>
>;

// 2-1. 응용

type UserGetter2 = {
  [T in keyof User as `get${Capitalize<T>}`]: () => User[T];
};
type Test_3 = Expect<
  Equal<UserGetter2, { getName: () => string; getAge: () => number }>
>;

// 3. never로 키제외

interface Post {
  id: number;
  title: string;
  authorId: string;
}

type OnlyIdKeys<T> = {
  [K in keyof T as K extends `${string}${'id' | 'Id'}` ? K : never]: T[K];
};

type Test_4 = Expect<Equal<OnlyIdKeys<Post>, { id: number; authorId: string }>>;

// 4. descriminated union

type Routes2 =
  | {
      route: '/';
      search: {
        page: string;
        perPage: string;
      };
    }
  | { route: '/home'; search: {} }
  | { route: '/my'; search: {} }
  | { route: '/my/users'; search: {} };

// 아래와 같이 key따로 value 따로 값을 추론해야 하는 번거로움이 있음
type Routes2Obj = {
  [R in Routes2['route']]: Extract<Routes2, { route: R }>['search'];
};

// 4.1 개선 : key에서 R을 as를 통해 R['route']에서 추론 했기 때문에 value에서도 추론된 R을 사용할 수 있다.
type AdvancedRoutes2Obj = {
  [R in Routes2 as R['route']]: R['search'];
};

type Test_5 = Expect<
  Equal<
    Routes2Obj,
    {
      '/': {
        page: string;
        perPage: string;
      };
      '/home': {};
      '/my': {};
      '/my/users': {};
    }
  >
>;
type Test_6 = Expect<
  Equal<
    AdvancedRoutes2Obj,
    {
      '/': {
        page: string;
        perPage: string;
      };
      '/home': {};
      '/my': {};
      '/my/users': {};
    }
  >
>;

// 5. object를 union으로

interface Fruit {
  apple: 'red';
  banana: 'yellow';
  orange: 'orange';
}

type TransformedFruit = {
  [F in keyof Fruit]: `${F}-${Fruit[F]}`;
}[keyof Fruit];

type Test_7 = [
  Expect<
    Equal<TransformedFruit, 'apple-red' | 'banana-yellow' | 'orange-orange'>
  >
];
// 6. discriminated union을 union으로
type Fruit2 =
  | {
      name: 'apple';
      color: 'red';
    }
  | {
      name: 'banana';
      color: 'yellow';
    }
  | {
      name: 'orange';
      color: 'orange';
    };

// 위에서 나온 방법들을 적절히 응용
type TransformedFruit2 = {
  [F in Fruit2 as F['name']]: `${F['name']}-${F['color']}`;
}[Fruit2['name']];

type Test_8 = [
  Expect<
    Equal<TransformedFruit2, 'apple-red' | 'banana-yellow' | 'orange-orange'>
  >
];
