// 제너릭이 true가 아니면 error
export type Expect<T extends true> = T;

export type BadEqual<X, Y> = X extends Y ? (Y extends X ? true : false) : false;
// 위에서 작성한 Equal 타입은 유니온타입이 들어오면 '조건부타입 분배'가 일어나서 리터럴 타입 true 또는 false이 아닌 boolean이라는 타입이 반환된다
// ex. true | true | false => boolean  (마지막 합치는 과정에서 값들을 boolean들로 추론해버리고 합쳐버리기 때문에)

// 따라서 아래의 Equal 타입과 같이 첫 제너릭을 배열로 변경하거나
// Equal2와 같이 함수로 변경하여 구현하면 '분배'가 일어나지 않아 정상적으로 비교가 가능하다

// 두개의 제너릭의 타입이 같으면 true
export type Equal<X, Y> = X[] extends Y[]
  ? Y extends X
    ? true
    : false
  : false;

export type Equal2<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? true
  : false;
