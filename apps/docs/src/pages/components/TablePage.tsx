import { useState } from 'react';
import { Table, Tag } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';
import type { ColumnType } from 'orot-ui';

interface User extends Record<string, unknown> {
  key: string;
  name: string;
  age: number;
  role: string;
  status: string;
}

const dataSource: User[] = [
  { key: '1', name: 'Alice', age: 28, role: 'Admin', status: 'active' },
  { key: '2', name: 'Bob', age: 34, role: 'User', status: 'inactive' },
  { key: '3', name: 'Carol', age: 25, role: 'Editor', status: 'active' },
  { key: '4', name: 'Dave', age: 41, role: 'User', status: 'banned' },
];

const columns: ColumnType<User>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sorter: true },
  { key: 'age', title: 'Age', dataIndex: 'age', sorter: true, width: 80, align: 'center' },
  { key: 'role', title: 'Role', dataIndex: 'role' },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'status',
    render: (value) => {
      const color = value === 'active' ? 'success' : value === 'inactive' ? 'default' : 'error';
      return <Tag color={color as any}>{String(value)}</Tag>;
    },
  },
];

export default function TablePage() {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  return (
    <DocPage title="Table" description="데이터를 표 형식으로 표시합니다. 정렬과 행 선택을 지원합니다.">
      <Example
        title="기본"
        code={`<Table columns={columns} dataSource={dataSource} />`}
      >
        <Table columns={columns} dataSource={dataSource} />
      </Example>

      <Example
        title="Bordered"
        code={`<Table columns={columns} dataSource={dataSource} bordered />`}
      >
        <Table columns={columns} dataSource={dataSource} bordered />
      </Example>

      <Example
        title="Row Selection"
        code={`<Table
  columns={columns}
  dataSource={dataSource}
  rowSelection={{ selectedRowKeys, onChange: setSelectedKeys }}
/>`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Table
            columns={columns}
            dataSource={dataSource}
            rowSelection={{
              selectedRowKeys: selectedKeys,
              onChange: (keys) => setSelectedKeys(keys),
            }}
          />
          <div style={{ fontSize: 12, color: 'var(--orot-color-text-secondary)' }}>
            Selected: {selectedKeys.join(', ') || 'none'}
          </div>
        </div>
      </Example>

      <Example
        title="Small size + Empty"
        code={`<Table columns={columns} dataSource={[]} size="sm" emptyText="No users found" />`}
      >
        <Table columns={columns} dataSource={[]} size="sm" emptyText="No users found" />
      </Example>

      <Example
        title="Pagination"
        code={`<Table
  columns={columns}
  dataSource={dataSource}
  pagination={{
    pageSize: 2,
    total: dataSource.length,
    showSizeChanger: true,
    showTotal: (total, range) => \`\${range[0]}-\${range[1]} / \${total}\`,
  }}
/>`}
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{
            pageSize: 2,
            total: dataSource.length,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
          }}
        />
      </Example>

      <Example
        title="Scroll + Fixed Columns"
        code={`<Table
  columns={[
    { key: 'name', title: 'Name', dataIndex: 'name', width: 140, fixed: 'left' },
    { key: 'age', title: 'Age', dataIndex: 'age', width: 100, align: 'center' },
    { key: 'role', title: 'Role', dataIndex: 'role', width: 160 },
    { key: 'status', title: 'Status', dataIndex: 'status', width: 160, fixed: 'right' },
  ]}
  dataSource={dataSource}
  scroll={{ x: 420 }}
/>`}
      >
        <Table
          columns={[
            { key: 'name', title: 'Name', dataIndex: 'name', width: 140, fixed: 'left' },
            { key: 'age', title: 'Age', dataIndex: 'age', width: 100, align: 'center' },
            { key: 'role', title: 'Role', dataIndex: 'role', width: 160 },
            {
              key: 'status',
              title: 'Status',
              dataIndex: 'status',
              width: 160,
              fixed: 'right',
              render: (value) => <Tag color={value === 'active' ? 'success' : value === 'inactive' ? 'default' : 'error'}>{String(value)}</Tag>,
            },
          ]}
          dataSource={dataSource}
          scroll={{ x: 420 }}
        />
      </Example>

      <PropsTable
        rows={[
          { name: 'columns', type: 'ColumnType[]', description: '컬럼 정의 배열' },
          { name: 'dataSource', type: 'T[]', description: '데이터 배열' },
          { name: 'rowKey', type: "keyof T | (record) => string", default: "'key'", description: '행 고유 키' },
          { name: 'loading', type: 'boolean', description: '로딩 상태' },
          { name: 'bordered', type: 'boolean', default: 'false', description: '셀 테두리' },
          { name: 'size', type: "'sm' | 'md'", default: "'md'", description: '크기 (패딩)' },
          { name: 'scroll', type: '{ x?: number | string; y?: number | string }', description: '스크롤 영역 크기' },
          { name: 'pagination', type: 'false | { current?: number; pageSize?: number; total?: number; showSizeChanger?: boolean; showTotal?: (total, range) => ReactNode; hideOnSinglePage?: boolean; onChange?: (page, pageSize) => void }', description: '하단 페이지네이션 설정' },
          { name: 'rowSelection', type: 'object', description: '행 선택 설정' },
          { name: 'locale', type: '{ emptyText?: ReactNode }', description: '테이블 문구 설정' },
          { name: 'rowClassName', type: 'string | (record, index) => string', description: '행 className 설정' },
          { name: 'onChange', type: '(pagination, filters, sorter) => void', description: '페이지/정렬 변경 콜백' },
          { name: 'emptyText', type: 'ReactNode', default: "'No data'", description: '빈 상태 텍스트' },
        ]}
      />
    </DocPage>
  );
}
