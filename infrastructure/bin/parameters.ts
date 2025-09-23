const ENV_NAMES = ["dev", "stg", "prd"] as const;
type EnvName = (typeof ENV_NAMES)[number]; // ユニオン型と等価

export interface AppParameter {
  projectName: string;
  envName: EnvName;
  envNameUpper: string;
  vpcCidr: string;
  imageTag: string;
  repositoryName: string;
  taskCpu: number;
  taskMemory: number;
  containerCpu: number;
  containerMemory: number;
  logLevel: string;
}

const commonParameters = {
  projectName: "iot-lens",
};

const appParameters: { [key in EnvName]: AppParameter } = {
  dev: {
    ...commonParameters,
    envName: "dev",
    envNameUpper: "Dev",
    vpcCidr: "10.100.0.0/16",
    imageTag: "dev-0.8", // ToDo: 後で変更
    repositoryName: "iot-lens",
    taskCpu: 256,
    taskMemory: 512,
    containerCpu: 256,
    containerMemory: 512,
    logLevel: "debug",
  },
  stg: {
    ...commonParameters,
    envName: "stg",
    envNameUpper: "Stg",
    vpcCidr: "10.100.0.0/16",
    imageTag: "stg", // ToDo: 後で変更
    repositoryName: "iot-lens",
    taskCpu: 256,
    taskMemory: 512,
    containerCpu: 256,
    containerMemory: 512,
    logLevel: "debug",
  },
  prd: {
    ...commonParameters,
    envName: "prd",
    envNameUpper: "Prd",
    imageTag: "prd", // ToDo: 後で変更
    vpcCidr: "10.100.0.0/16",
    repositoryName: "iot-lens",
    taskCpu: 256,
    taskMemory: 512,
    containerCpu: 256,
    containerMemory: 512,
    logLevel: "info",
  },
};

export const getAppParameters = (envKey: string): AppParameter => {
  if (!isEnv(envKey)) {
    throw new Error(`Not found environment key: ${envKey}`);
  }

  const params = appParameters[envKey];
  return params;
};

const isEnv = (value: string): value is EnvName => {
  // valueがEnvName 型に含まれるかどうかを判定する型ガード関数
  return (ENV_NAMES as readonly string[]).includes(value);
};
