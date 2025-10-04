import * as z from 'zod';

const createEnv = () => {
    const EnvSchema = z.object({
        API_URL: z.string(),
    });

    const envVars = Object.entries(import.meta.env).reduce<Record<string, string>>((acc, curr) => {
        const [key, value] = curr;
        if (key.startsWith('VITE_APP_')) {
            acc[key.replace('VITE_APP_', '')] = value;
        }
        return acc;
    }, {});

    const parsedEnv = EnvSchema.safeParse(envVars);

    if (!parsedEnv.success) {
        console.warn('環境変数の解析に失敗しました。デフォルト値を使用します。', parsedEnv.error);
        return EnvSchema.parse({});
    }

    return parsedEnv.data;
};

export const env = createEnv();