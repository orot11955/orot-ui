import { Avatar } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function AvatarPage() {
  return (
    <DocPage title="Avatar" description="사용자를 나타내는 아바타 컴포넌트입니다.">
      <Example
        title="기본 (텍스트)"
        code={`<Avatar>U</Avatar>
<Avatar>AB</Avatar>`}
      >
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Avatar>U</Avatar>
          <Avatar>AB</Avatar>
          <Avatar>홍길동</Avatar>
        </div>
      </Example>

      <Example
        title="Shape"
        code={`<Avatar shape="circle">C</Avatar>
<Avatar shape="square">S</Avatar>`}
      >
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Avatar shape="circle">C</Avatar>
          <Avatar shape="square">S</Avatar>
        </div>
      </Example>

      <Example
        title="Size"
        code={`<Avatar size="sm">S</Avatar>
<Avatar size="md">M</Avatar>
<Avatar size="lg">L</Avatar>
<Avatar size={64}>64</Avatar>`}
      >
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Avatar size="sm">S</Avatar>
          <Avatar size="md">M</Avatar>
          <Avatar size="lg">L</Avatar>
          <Avatar size={64}>64</Avatar>
        </div>
      </Example>

      <Example
        title="Icon Avatar"
        code={`<Avatar icon="👤" />`}
      >
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Avatar icon="👤" />
          <Avatar icon="🔔" size="lg" />
        </div>
      </Example>

      <Example
        title="Avatar.Group"
        description="maxCount으로 오버플로우 개수를 제한합니다."
        code={`<Avatar.Group maxCount={3}>
  <Avatar>A</Avatar>
  <Avatar>B</Avatar>
  <Avatar>C</Avatar>
  <Avatar>D</Avatar>
  <Avatar>E</Avatar>
</Avatar.Group>`}
      >
        <Avatar.Group maxCount={3}>
          <Avatar>A</Avatar>
          <Avatar>B</Avatar>
          <Avatar>C</Avatar>
          <Avatar>D</Avatar>
          <Avatar>E</Avatar>
        </Avatar.Group>
      </Example>

      <PropsTable
        rows={[
          { name: 'src', type: 'string', description: '이미지 URL' },
          { name: 'alt', type: 'string', description: '이미지 대체 텍스트' },
          { name: 'icon', type: 'ReactNode', description: '아이콘 (이미지 없을 때)' },
          { name: 'shape', type: "'circle' | 'square'", default: "'circle'", description: '모양' },
          { name: 'size', type: "'sm' | 'md' | 'lg' | number", default: "'md'", description: '크기' },
          { name: 'gap', type: 'number', default: '4', description: '텍스트 좌우 패딩' },
          { name: 'children', type: 'ReactNode', description: '텍스트 내용' },
          { name: 'onError', type: '() => boolean', description: '이미지 에러 핸들러' },
        ]}
      />
    </DocPage>
  );
}
