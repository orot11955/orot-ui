import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

function createCache(limit = 512) {
  const store = new Map();
  const stats = {
    hits: 0,
    misses: 0,
    writes: 0,
    evictions: 0,
  };

  return {
    stats,
    get(key) {
      const cached = store.get(key);
      if (!cached) {
        stats.misses += 1;
        return undefined;
      }

      stats.hits += 1;
      store.delete(key);
      store.set(key, cached);
      return cached.slice();
    },
    set(key, lines) {
      if (store.has(key)) {
        store.delete(key);
      }

      store.set(key, lines.slice());
      stats.writes += 1;

      if (store.size > limit) {
        const oldestKey = store.keys().next().value;
        if (oldestKey !== undefined) {
          store.delete(oldestKey);
          stats.evictions += 1;
        }
      }
    },
  };
}

const distPath = path.resolve(process.cwd(), 'dist/index.mjs');
const { renderMarkdown } = await import(pathToFileURL(distPath).href);

const longList = Array.from(
  { length: 120 },
  (_, index) => `- 항목 ${index + 1}: 캐시 재사용 확인용 줄입니다.`,
).join('\n');

const sample = [
  '# 캐시 확인 문서',
  '',
  '서두 문단입니다.',
  '',
  longList,
  '',
  '| Name | Value |',
  '| ---- | ----- |',
  '| Alpha | 1 |',
  '| Beta | 2 |',
  '',
  '```ts',
  'export function add(a: number, b: number) {',
  '  return a + b;',
  '}',
  '```',
  '',
  '마지막 문단입니다.',
].join('\n');

const cache = createCache();

const firstRender = renderMarkdown(sample, { cache });
assert.ok(firstRender.includes('캐시 확인 문서'));
assert.ok(cache.stats.misses > 0, '첫 렌더에서는 캐시 miss가 기록되어야 합니다.');

const firstPassHits = cache.stats.hits;
const firstPassMisses = cache.stats.misses;
const secondRender = renderMarkdown(sample, { cache });
assert.equal(secondRender, firstRender, '같은 입력은 동일한 HTML을 반환해야 합니다.');
assert.ok(
  cache.stats.hits > firstPassHits,
  '두 번째 렌더에서는 캐시 hit가 추가로 발생해야 합니다.',
);
assert.equal(
  cache.stats.misses,
  firstPassMisses,
  '동일 입력 재렌더에서는 새 miss가 증가하지 않아야 합니다.',
);

const updated = sample.replace('항목 75', '항목 75 updated');
renderMarkdown(updated, { cache });
assert.ok(
  cache.stats.hits > 0,
  '일부 문서만 변경돼도 기존 block cache를 재사용해야 합니다.',
);
assert.ok(
  cache.stats.misses > firstPassMisses,
  '변경된 block만 새로 계산되어 miss가 일부 증가해야 합니다.',
);

console.log(JSON.stringify({ stats: cache.stats }, null, 2));
