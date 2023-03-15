// 1. 제너릭을 인자의 다른 depth에서도 사용할 수 있다.

import { Equal, Expect } from './type-utils/utils';

const extractHomePageFlags = <T>(configs: {
  rawConfig: {
    featureFlags: {
      homePage: T;
    };
  };
}) => {
  return configs.rawConfig.featureFlags.homePage;
};

const EXAMPLE_CONFIG = {
  apiEndpoint: 'https://api.example.com',
  apiVersion: 'v1',
  apiKey: '1234567890',
  rawConfig: {
    featureFlags: {
      homePage: {
        showBanner: true,
        showLogOut: false,
      },
      loginPage: {
        showCaptcha: true,
        showConfirmPassword: false,
      },
    },
  },
};
const flags = extractHomePageFlags(EXAMPLE_CONFIG);

type Test_1 = Expect<
  Equal<typeof flags, { showBanner: boolean; showLogOut: boolean }>
>;
