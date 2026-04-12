import { Link } from 'react-router-dom';
import { HOME_COMPONENT_GROUPS } from '../config/navigation';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home">
      <div className="home__hero">
        <h1 className="home__title">orot-ui</h1>
        <p className="home__subtitle">
          재사용 가능한 React UI 컴포넌트 라이브러리.
          <br />
          레이아웃 강점 · 반응형 · 베어 마크다운 메모앱 컨셉
        </p>
        <div className="home__badges">
          <span className="home__badge">v0.1.0</span>
          <span className="home__badge">React 18</span>
          <span className="home__badge">TypeScript</span>
        </div>
      </div>

      <div className="home__section">
        <h2 className="home__section-title">Quick Start</h2>
        <pre className="home__code">{`# 설치
아직 구현 중이므로 체험을 원할 시 orot1195@gmail.com으로 연락 부탁드립니다.

# 글로벌 스타일 (main.tsx 또는 _app.tsx)
import 'orot-ui/styles/global.css';
import 'orot-ui/themes/light.css';   // light | dark | sepia | ocean | frest`}</pre>
      </div>

      <div className="home__section">
        <h2 className="home__section-title">Themes</h2>
        <div className="home__theme-grid">
          {[
            { name: 'light', desc: '흰 종이 위의 잉크' },
            { name: 'dark', desc: '터미널 / 코드 에디터' },
            { name: 'sepia', desc: '빈티지 노트 · 일기장' },
            { name: 'ocean', desc: '푸른빛의 바다' },
            { name: 'forest', desc: '숲과 같은 녹색' },
          ].map((t) => (
            <div key={t.name} className="home__theme-card">
              <strong>{t.name}</strong>
              <span>{t.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="home__section">
        <h2 className="home__section-title">Components</h2>
        <div className="home__component-grid">
          {HOME_COMPONENT_GROUPS.map((g) => (
            <div key={g.group} className="home__component-group">
              <div className="home__component-group-label">{g.group}</div>
              <div className="home__component-list">
                {g.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="home__component-link"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
