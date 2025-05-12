import moment from 'moment';

export type GenerateVersionPluginOptions = {
  fileName?: string;
  versionStrategy?: Function | string;
};

/**
 * 生成版本信息插件
 * @param {Object} options 配置选项
 * @param {string} [options.fileName='version.json'] 输出文件名
 * @param {Function|string} [options.versionStrategy] 版本生成策略（时间戳或Git Commit Hash）
 */
export default function generateVersionPlugin(options?: GenerateVersionPluginOptions) {
  const { fileName = 'version.json', versionStrategy } = options || {};
  let _outDir: string;

  return {
    name: 'vite-plugin-generate-version',
    enforce: 'post', // 确保在所有插件之后执行
    apply: 'build', // 仅在构建阶段生效
    // configResolved 是在所有用户配置都被解析和合并之后调用的钩子
    configResolved(config: any) {
      _outDir = config.build.outDir;
    },
    closeBundle: {
      sequential: true, // 串行执行
      async handler() {
        const outDir = _outDir || 'dist';

        // 版本生成逻辑
        let version;
        if (typeof versionStrategy === 'function') {
          version = versionStrategy();
        } else if (versionStrategy === 'git') {
          const child_process = await import('child_process');
          version = child_process.execSync('git rev-parse --short HEAD').toString().trim();
        } else {
          version = moment().format('YYYYMMDDHHmmss'); // 默认时间戳
        }

        // 写入文件
        const versionInfo = {
          version,
          buildTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
        const fs = await import('fs');
        const path = await import('path');
        if (!fs.existsSync(outDir)) {
          fs.mkdirSync(outDir, { recursive: true });
        }
        fs.writeFileSync(
          path.join(outDir, fileName),
          JSON.stringify(versionInfo),
        );
      },
    },
  };
}
