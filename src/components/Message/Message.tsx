import { createRoot } from 'react-dom/client';
import './Message.css';
import type { ReactNode } from 'react';
import type { MessageConfig, MessageInstance, MessageMethodConfig, MessageType } from './Message.types';

const TYPE_ICONS: Record<string, string> = {
  success: '✅',
  info: 'ℹ️',
  warning: '⚠️',
  error: '❌',
  loading: '⏳',
};

interface MessageItem extends MessageConfig {
  id: string;
  closeFn: () => void;
}

let containerEl: HTMLElement | null = null;
let containerRoot: ReturnType<typeof createRoot> | null = null;
let items: MessageItem[] = [];

function getContainer() {
  if (!containerEl) {
    containerEl = document.createElement('div');
    containerEl.className = 'orot-message-container';
    document.body.appendChild(containerEl);
    containerRoot = createRoot(containerEl);
  }
  return { el: containerEl, root: containerRoot! };
}

function renderAll() {
  const { root } = getContainer();
  root.render(
    <div>
      {items.map(item => (
        <div
          key={item.id}
          className={['orot-message', item.type && `orot-message--${item.type}`, item.className].filter(Boolean).join(' ')}
          style={item.style}
          onClick={item.onClick}
        >
          <span className="orot-message__icon">
            {item.icon ?? (item.type ? TYPE_ICONS[item.type] : null)}
          </span>
          <span className="orot-message__content">{item.content}</span>
          <button
            type="button"
            className="orot-message__close"
            onClick={(e) => { e.stopPropagation(); item.closeFn(); }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

let idCounter = 0;

function isMessageMethodConfig(value: unknown): value is MessageMethodConfig {
  return typeof value === 'object' && value !== null && 'content' in value;
}

function openWithType(
  type: MessageType,
  contentOrConfig: ReactNode | MessageMethodConfig,
  duration?: number,
): () => void {
  if (isMessageMethodConfig(contentOrConfig)) {
    return open({ ...contentOrConfig, type });
  }

  return open({ content: contentOrConfig, type, duration });
}

function open(config: MessageConfig): () => void {
  getContainer();
  const id = config.key ?? String(++idCounter);
  const duration = config.duration === undefined ? 3 : config.duration;

  items = items.filter(i => i.id !== id);
  items.push({ ...config, id, closeFn: () => close() });
  renderAll();

  let cleared = false;
  const close = () => {
    if (cleared) return;
    cleared = true;
    items = items.filter(i => i.id !== id);
    renderAll();
    config.onClose?.();
  };

  if (duration !== null && duration > 0) {
    setTimeout(close, duration * 1000);
  }

  return close;
}

function success(content: ReactNode, duration?: number): () => void;
function success(config: MessageMethodConfig): () => void;
function success(contentOrConfig: ReactNode | MessageMethodConfig, duration?: number): () => void {
  return openWithType('success', contentOrConfig, duration);
}

function info(content: ReactNode, duration?: number): () => void;
function info(config: MessageMethodConfig): () => void;
function info(contentOrConfig: ReactNode | MessageMethodConfig, duration?: number): () => void {
  return openWithType('info', contentOrConfig, duration);
}

function warning(content: ReactNode, duration?: number): () => void;
function warning(config: MessageMethodConfig): () => void;
function warning(contentOrConfig: ReactNode | MessageMethodConfig, duration?: number): () => void {
  return openWithType('warning', contentOrConfig, duration);
}

function error(content: ReactNode, duration?: number): () => void;
function error(config: MessageMethodConfig): () => void;
function error(contentOrConfig: ReactNode | MessageMethodConfig, duration?: number): () => void {
  return openWithType('error', contentOrConfig, duration);
}

function loading(content: ReactNode, duration?: number): () => void;
function loading(config: MessageMethodConfig): () => void;
function loading(contentOrConfig: ReactNode | MessageMethodConfig, duration?: number): () => void {
  if (isMessageMethodConfig(contentOrConfig)) {
    return open({
      ...contentOrConfig,
      type: 'loading',
      duration: contentOrConfig.duration ?? 0,
    });
  }

  return open({ content: contentOrConfig, type: 'loading', duration: duration ?? 0 });
}

export const message: MessageInstance = {
  open,
  success,
  info,
  warning,
  error,
  loading,
  destroy: (key) => {
    if (key) items = items.filter(i => i.id !== key);
    else items = [];
    renderAll();
  },
};

export function useMessage(): [MessageInstance, ReactNode] {
  return [message, null];
}
