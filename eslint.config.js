import { alvarosabu } from '@alvarosabu/eslint-config'

export default alvarosabu({
  ignores: ['node_modules', 'dist', 'build', '**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
})
