import './PropsTable.css';

interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

interface PropsTableProps {
  rows: PropRow[];
  title?: string;
}

export function PropsTable({ rows, title }: PropsTableProps) {
  return (
    <div className="props-table-wrap">
      {title && <h3 className="props-table__title">&nbsp;{title}</h3>}
      <table className="props-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>
                <code className="props-table__name">
                  {row.name}
                  {row.required && <span className="props-table__required"> *</span>}
                </code>
              </td>
              <td><code className="props-table__type">{row.type}</code></td>
              <td>
                {row.default ? (
                  <code className="props-table__default">{row.default}</code>
                ) : (
                  <span className="props-table__none">—</span>
                )}
              </td>
              <td className="props-table__desc">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
