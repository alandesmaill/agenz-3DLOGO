/**
 * A/B Testing Framework - Context
 * React context for sharing variant information across components
 */

import { createContext } from 'react';
import { ABTestVariant } from './constants';

export const ABTestContext = createContext<ABTestVariant | undefined>(undefined);
