import { Form, Input, Select, Switch, Button } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function FormPage() {
  return (
    <DocPage title="Form" description="데이터 입력을 위한 폼 레이아웃과 유효성 상태를 관리합니다.">
      <Example
        title="Vertical (기본)"
        code={`<Form
  layout="vertical"
  initialValues={{ role: 'user' }}
  onFinish={(values) => console.log(values)}
>
  <Form.Item
    label="Username"
    name="username"
    rules={[{ required: true, message: 'Username is required.' }]}
  >
    <Input placeholder="Enter username" />
  </Form.Item>
  <Form.Item label="Email" name="email">
    <Input type="email" placeholder="Enter email" />
  </Form.Item>
  <Button htmlType="submit">Submit</Button>
</Form>`}
      >
        <Form
          layout="vertical"
          initialValues={{ role: 'user' }}
          onFinish={(values) => alert(JSON.stringify(values, null, 2))}
          style={{ maxWidth: 360 }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Username is required.' }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input type="email" placeholder="Enter email" />
          </Form.Item>
          <Form.Item label="Role" name="role">
            <Select
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'user', label: 'User' },
                { value: 'guest', label: 'Guest' },
              ]}
              placeholder="Select role"
            />
          </Form.Item>
          <Button htmlType="submit">Submit</Button>
        </Form>
      </Example>

      <Example
        title="Horizontal"
        code={`<Form layout="horizontal">
  <Form.Item label="Field" name="field">
    <Input />
  </Form.Item>
</Form>`}
      >
        <Form layout="horizontal" style={{ maxWidth: 480 }}>
          <Form.Item label="Username" name="username">
            <Input placeholder="Enter username" />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input placeholder="Enter email" />
          </Form.Item>
        </Form>
      </Example>

      <Example
        title="Rules + valuePropName"
        code={`<Form
  layout="vertical"
  initialValues={{ agree: true }}
  onFinish={(values) => console.log(values)}
>
  <Form.Item
    label="Email"
    name="email"
    rules={[{ required: true, message: 'Email is required.' }]}
  >
    <Input type="email" />
  </Form.Item>
  <Form.Item
    label="Agree"
    name="agree"
    valuePropName="checked"
    rules={[{ validator: (value) => value ? true : 'Please accept the agreement.' }]}
  >
    <Switch />
  </Form.Item>
  <Button htmlType="submit">Validate</Button>
</Form>`}
      >
        <Form layout="vertical" initialValues={{ agree: true }} style={{ maxWidth: 360 }}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Email is required.' }]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            label="Agree"
            name="agree"
            valuePropName="checked"
            rules={[{ validator: (value) => value ? true : 'Please accept the agreement.' }]}
          >
            <Switch />
          </Form.Item>
          <Button htmlType="submit">Validate</Button>
        </Form>
      </Example>

      <Example
        title="Validate Trigger"
        code={`<Form layout="vertical" validateTrigger="onBlur">
  <Form.Item
    label="Nickname"
    name="nickname"
    rules={[{ required: true, message: 'Nickname is required.' }]}
  >
    <Input placeholder="Blur to validate" />
  </Form.Item>
</Form>`}
      >
        <Form layout="vertical" validateTrigger="onBlur" style={{ maxWidth: 360 }}>
          <Form.Item
            label="Nickname"
            name="nickname"
            rules={[{ required: true, message: 'Nickname is required.' }]}
          >
            <Input placeholder="Blur to validate" />
          </Form.Item>
        </Form>
      </Example>

      <PropsTable
        rows={[
          { name: 'layout', type: "'vertical' | 'horizontal' | 'inline'", default: "'vertical'", description: '폼 레이아웃' },
          { name: 'initialValues', type: 'Record<string, unknown>', description: '초기 필드 값' },
          { name: 'validateTrigger', type: "'onChange' | 'onBlur' | Array<'onChange' | 'onBlur'>", default: "'onChange'", description: '기본 필드 검증 트리거' },
          { name: 'onFinish', type: '(values: Record<string, unknown>) => void', description: '검증 성공 후 제출 콜백' },
          { name: 'onFinishFailed', type: '(info) => void', description: '검증 실패 콜백' },
          { name: 'onValuesChange', type: '(changedValues, allValues) => void', description: '필드 값 변경 콜백' },
        ]}
      />

      <div style={{ marginTop: 24 }}>
        <h3 style={{ fontWeight: 500, marginBottom: 8 }}>Form.Item Props</h3>
        <PropsTable
          rows={[
            { name: 'label', type: 'ReactNode', description: '필드 레이블' },
            { name: 'name', type: 'string', description: '폼 필드 이름' },
            { name: 'required', type: 'boolean', description: '필수 표시 (*) 추가' },
            { name: 'rules', type: 'FormRule[]', description: '필드 검증 규칙 배열' },
            { name: 'valuePropName', type: 'string', default: "'value'", description: '컨트롤 값으로 사용할 prop 이름' },
            { name: 'validateTrigger', type: "'onChange' | 'onBlur' | Array<'onChange' | 'onBlur'>", description: '개별 필드 검증 트리거' },
            { name: 'initialValue', type: 'unknown', description: '필드 개별 초기값' },
            { name: 'validateStatus', type: "'success' | 'warning' | 'error' | 'validating'", description: '유효성 상태' },
            { name: 'help', type: 'ReactNode', description: '도움말/에러 메시지' },
            { name: 'extra', type: 'ReactNode', description: '추가 설명 텍스트' },
          ]}
        />
      </div>
    </DocPage>
  );
}
