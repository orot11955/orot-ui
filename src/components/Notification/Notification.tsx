import { createRoot } from 'react-dom/client';
import './Notification.css';
import type { NotificationConfig, NotificationInstance, NotificationPlacement } from './Notification.types';

const TYPE_ICONS: Record<string, string> = {
  success: '✅',
  info: 'ℹ️',
  warning: '⚠️',
  error: '❌',
};

interface NotificationItem extends NotificationConfig {
  id: string;
}

interface Container {
  el: HTMLElement;
  items: NotificationItem[];
  render: () => void;
}

const containers: Partial<Record<NotificationPlacement, Container>> = {};

function getContainer(placement: NotificationPlacement): Container {
  if (containers[placement]) return containers[placement]!;

  const el = document.createElement('div');
  el.className = `orot-notification-container orot-notification-container--${placement}`;
  document.body.appendChild(el);

  const root = createRoot(el);

  // Use an object so render() always reads the current items array
  const container: Container = {
    el,
    items: [],
    render() {
      root.render(
        <div>
          {container.items.map(item => (
            <NotificationItemEl
              key={item.id}
              item={item}
              onClose={() => {
                container.items = container.items.filter(i => i.id !== item.id);
                container.render();
                item.onClose?.();
              }}
            />
          ))}
        </div>
      );
    },
  };

  containers[placement] = container;
  return container;
}

function NotificationItemEl({ item, onClose }: { item: NotificationItem; onClose: () => void }) {
  return (
    <div
      className={['orot-notification', item.type && `orot-notification--${item.type}`, item.className].filter(Boolean).join(' ')}
      style={item.style}
      onClick={item.onClick}
    >
      <div className="orot-notification__icon">
        {item.icon ?? (item.type ? TYPE_ICONS[item.type] : null)}
      </div>
      <div className="orot-notification__content">
        <div className="orot-notification__message">{item.message}</div>
        {item.description && <div className="orot-notification__description">{item.description}</div>}
        {item.btn && <div className="orot-notification__btn">{item.btn}</div>}
      </div>
      {item.closable !== false && (
        <button type="button" className="orot-notification__close" onClick={(e) => { e.stopPropagation(); onClose(); }}>
          {item.closeIcon ?? '✕'}
        </button>
      )}
    </div>
  );
}

let idCounter = 0;

function open(config: NotificationConfig) {
  const placement = config.placement ?? 'topRight';
  const container = getContainer(placement);
  const id = config.key ?? String(++idCounter);
  const duration = config.duration === undefined ? 4.5 : config.duration;

  // Remove existing with same key, then add new
  container.items = container.items.filter(i => i.id !== id);
  container.items.push({ ...config, id });
  container.render();

  if (duration !== null && duration > 0) {
    setTimeout(() => {
      container.items = container.items.filter(i => i.id !== id);
      container.render();
      config.onClose?.();
    }, duration * 1000);
  }
}

export const notification: NotificationInstance = {
  open,
  success: (config) => open({ ...config, type: 'success' }),
  info: (config) => open({ ...config, type: 'info' }),
  warning: (config) => open({ ...config, type: 'warning' }),
  error: (config) => open({ ...config, type: 'error' }),
  destroy: (key) => {
    for (const placement of Object.keys(containers) as NotificationPlacement[]) {
      const container = containers[placement]!;
      container.items = key
        ? container.items.filter(i => i.id !== key)
        : [];
      container.render();
    }
  },
};

export function useNotification(): [NotificationInstance, React.ReactNode] {
  return [notification, null];
}
