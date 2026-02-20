'use client'

import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0F766E',
    },
    background: {
      default: '#F9FAFB',
    },
  },

  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily: 'Inter, sans-serif',

    h5: {
      fontWeight: 700,
    },

    h6: {
      fontWeight: 600,
    },

    body2: {
      color: '#6B7280',
    },
  },
})