'use client'

import {
  AppBar,
  Avatar,
  Box,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import {
  Search as SearchIcon,
  KeyboardArrowDown as ChevronIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/lib/auth/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [search, setSearch] = useState('')

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)
  const handleCloseMenu = () => setAnchorEl(null)

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && search.trim()) {
      router.push(`/articles?q=${encodeURIComponent(search.trim())}`)
    }
  }

  const navLinks = [
    { label: 'Home', href: '/articles' },
    ...(user?.isAuthor ? [{ label: 'Dashboard', href: '/dashboard/articles' }] : []),
    { label: 'Profile', href: '/profile' },
  ]

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || user.username[0]?.toUpperCase()
    : '?'

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 3, py: 0.5 }}>
          {/* Logo */}
          <Box
            component={Link}
            href="/articles"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
              }}
            >
              ✍️
            </Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ color: 'text.primary', fontFamily: '"Georgia", serif' }}
            >
              BlogApp
            </Typography>
          </Box>

          {/* Nav links — centrés */}
          <Box sx={{ display: 'flex', gap: 0.5, flexGrow: 1, justifyContent: 'center' }}>
            {navLinks.map((link) => (
              <Typography
                key={link.href}
                component={Link}
                href={link.href}
                sx={{
                  px: 2,
                  py: 1,
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: pathname === link.href ? 600 : 400,
                  color: pathname === link.href ? 'text.primary' : 'text.secondary',
                  borderRadius: 2,
                  transition: 'color 0.15s',
                  '&:hover': { color: 'text.primary' },
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Box>

          {/* Search bar */}
          <TextField
            size="small"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: 220,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: '#F0EBE4',
                '& fieldset': { border: 'none' },
                '&:hover fieldset': { border: 'none' },
                '&.Mui-focused fieldset': { border: '1px solid', borderColor: 'primary.main' },
              },
              '& input': { fontSize: '0.875rem' },
            }}
          />

          {/* Avatar + nom + dropdown */}
          {user && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                borderRadius: 2,
                px: 1,
                py: 0.5,
                '&:hover': { bgcolor: '#F0EBE4' },
              }}
              onClick={handleOpenMenu}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: '#C4956A',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}
              >
                {initials}
              </Avatar>
              <Typography variant="body2" fontWeight={500} sx={{ ml: 0.5 }}>
                {user.firstName || user.username}
              </Typography>
              <ChevronIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            </Box>
          )}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 2,
              sx: { mt: 1, minWidth: 200, borderRadius: 2 },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography fontWeight={600} fontSize="0.9rem">
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem component={Link} href="/profile" onClick={handleCloseMenu} sx={{ gap: 1.5, py: 1.2, fontSize: '0.875rem' }}>
              <PersonIcon fontSize="small" color="action" /> Mon profil
            </MenuItem>
            {user?.isAuthor && (
              <MenuItem component={Link} href="/dashboard/articles" onClick={handleCloseMenu} sx={{ gap: 1.5, py: 1.2, fontSize: '0.875rem' }}>
                <DashboardIcon fontSize="small" color="action" /> Dashboard
              </MenuItem>
            )}
            <Divider />
            <MenuItem onClick={() => { handleCloseMenu(); logout() }} sx={{ gap: 1.5, py: 1.2, fontSize: '0.875rem', color: 'error.main' }}>
              <LogoutIcon fontSize="small" /> Se déconnecter
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  )
}