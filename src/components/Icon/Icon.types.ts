import type { LucideProps } from 'lucide-react';
import type { ComponentType } from 'react';

export interface IconProps extends LucideProps {
  as: ComponentType<LucideProps>;
}
