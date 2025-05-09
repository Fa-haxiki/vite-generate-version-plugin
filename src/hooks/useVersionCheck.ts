// @ts-nocheck
import { useLayoutEffect, useRef } from 'react';

export type UseVersionCheckOptions = {
  onNewVersionCallback?: (options: {
    currentVersion: string;
    latestVersion: string;
  }) => void;
  fetchVersionUrl: string;
  checkInterval?: number;
};

/**
 * 版本检测 hook
 */
export default function useVersionCheck({
  onNewVersionCallback, // 版本更新回调函数
  fetchVersionUrl, // 版本信息获取地址
  checkInterval = 60 * 1000, // 检测间隔时间
}: UseVersionCheckOptions) {
  const currentVersion = useRef<string | null>(null);
  const modalShow = useRef<boolean>(false);
  const versionCheckInterval = useRef<number>();

  // 检测版本更新
  async function checkVersion() {
    try {
      if (modalShow.current) return; // 防止多次弹出提示框

      const res = await fetch(fetchVersionUrl, { cache: 'no-store' });
      const data = await res.json();
      const latestVersion = data.version;

      if (!currentVersion.current) {
        currentVersion.current = latestVersion; // 首次加载存储版本
        return;
      }

      if (currentVersion.current !== latestVersion) {
        modalShow.current = true;
        window.clearInterval(versionCheckInterval.current); // 停止定时检测
        versionCheckInterval.current = undefined;
        if (!onNewVersionCallback) {
          alert(`发现新版本 ${latestVersion}，请手动刷新页面`);
          return;
        }
        onNewVersionCallback({
          currentVersion: currentVersion.current,
          latestVersion,
        });
      }
    } catch (error) {
      console.error('版本检测失败:', error);
    }
  }

  useLayoutEffect(() => {
    if (process.env.NODE_ENV === 'development') return; // 开发环境不检测版本
    checkVersion();
    versionCheckInterval.current = window.setInterval(() => {
      checkVersion();
    }, checkInterval);
    return () => {
      window.clearInterval(versionCheckInterval.current);
      versionCheckInterval.current = undefined;
    };
  }, []);
}
