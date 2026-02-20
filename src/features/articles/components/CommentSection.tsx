'use client'

import {
  Box, Typography, Avatar, TextField, Button,
  IconButton, Divider, CircularProgress,
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Send as SendIcon,
  ChatBubbleOutline as CommentIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { useState } from 'react'
import { useAddComment, useDeleteComment, useUpdateComment } from '../hooks/useArticleDetail'
import { useAuth } from '@/lib/auth/useAuth'
import { CommentResponse } from '@/types'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}
function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}
const AVATAR_COLORS = ['#6B9E78', '#C4956A', '#7B8EC8', '#C47A7A', '#8EC4C4']
function getAvatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
}

interface CommentItemProps {
  comment: CommentResponse
  slug: string
  canDelete: boolean
  canEdit: boolean
}

function CommentItem({ comment, slug, canDelete, canEdit }: CommentItemProps) {
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const deleteComment = useDeleteComment(slug)
  const updateComment = useUpdateComment(slug)

  const handleSaveEdit = () => {
    if (!editContent.trim()) return
    updateComment.mutate(
      { commentId: comment.id, content: editContent.trim() },
      { onSuccess: () => setEditing(false) }
    )
  }

  return (
    <Box sx={{ display: 'flex', gap: 1.5, py: 2.5 }}>
      <Avatar sx={{ width: 36, height: 36, fontSize: '0.78rem', fontWeight: 700, bgcolor: getAvatarColor(comment.author), flexShrink: 0 }}>
        {getInitials(comment.author)}
      </Avatar>
      <Box sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="body2" fontWeight={600} color="text.primary">{comment.author}</Typography>
            <Typography variant="caption" color="text.disabled">{formatDate(comment.createdAt)}</Typography>
          </Box>
          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {canEdit && !editing && (
              <IconButton size="small" onClick={() => setEditing(true)}
                sx={{ color: 'text.disabled', '&:hover': { color: '#1A7A5E', bgcolor: 'rgba(26,122,94,0.06)' } }}>
                <EditIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}
            {canDelete && !editing && (
              <IconButton size="small" onClick={() => deleteComment.mutate(comment.id)}
                disabled={deleteComment.isPending}
                sx={{ color: 'text.disabled', '&:hover': { color: 'error.main', bgcolor: 'rgba(220,38,38,0.06)' } }}>
                <DeleteIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Contenu ou éditeur inline */}
        {editing ? (
          <Box>
            <TextField
              fullWidth
              multiline
              size="small"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.9rem',
                  '&.Mui-focused fieldset': { borderColor: '#1A7A5E' },
                },
              }}
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <IconButton size="small" onClick={handleSaveEdit} disabled={updateComment.isPending}
                sx={{ color: '#1A7A5E', bgcolor: 'rgba(26,122,94,0.08)', borderRadius: 1.5 }}>
                {updateComment.isPending ? <CircularProgress size={14} /> : <CheckIcon sx={{ fontSize: 16 }} />}
              </IconButton>
              <IconButton size="small" onClick={() => { setEditing(false); setEditContent(comment.content) }}
                sx={{ color: 'text.disabled', bgcolor: 'rgba(0,0,0,0.04)', borderRadius: 1.5 }}>
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <Typography variant="body2" color="text.primary" lineHeight={1.65}>
            {comment.content}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

interface CommentSectionProps {
  slug: string
  comments: CommentResponse[]
}

export default function CommentSection({ slug, comments }: CommentSectionProps) {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const addComment = useAddComment(slug)

  const handleSubmit = () => {
    if (!content.trim()) return
    addComment.mutate(content.trim(), { onSuccess: () => setContent('') })
  }

  return (
    <Box id="comments">
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <CommentIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
        <Typography variant="h6" fontWeight={700} sx={{ fontFamily: '"Georgia", serif' }}>
          {comments.length} commentaire{comments.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Formulaire ajout */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 4, p: 2, bgcolor: '#F5F0EB', borderRadius: 3 }}>
        <Avatar sx={{ width: 36, height: 36, fontSize: '0.78rem', fontWeight: 700, bgcolor: user ? getAvatarColor(user.username) : '#ccc', flexShrink: 0 }}>
          {user ? getInitials(user.firstName || user.username) : '?'}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <TextField
            fullWidth multiline minRows={2} maxRows={5}
            placeholder="Écrire un commentaire..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'white', borderRadius: 2, fontSize: '0.9rem',
                '& fieldset': { borderColor: 'divider' },
                '&:hover fieldset': { borderColor: '#1A7A5E' },
                '&.Mui-focused fieldset': { borderColor: '#1A7A5E' },
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Button
              variant="contained" size="small"
              endIcon={addComment.isPending ? <CircularProgress size={14} color="inherit" /> : <SendIcon />}
              onClick={handleSubmit}
              disabled={!content.trim() || addComment.isPending}
              sx={{ bgcolor: '#1A7A5E', '&:hover': { bgcolor: '#156B51' }, borderRadius: 2, px: 2.5, fontWeight: 600, textTransform: 'none' }}
            >
              Publier
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Liste */}
      {comments.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="body2" color="text.disabled">Soyez le premier à commenter !</Typography>
        </Box>
      ) : (
        <Box>
          {comments.map((comment, index) => (
            <Box key={comment.id}>
              <CommentItem
                comment={comment}
                slug={slug}
                // Peut supprimer : son propre commentaire ou admin
                canDelete={user?.username === comment.author || !!user?.isAdmin}
                // Peut éditer : uniquement son propre commentaire
                canEdit={user?.username === comment.author}
              />
              {index < comments.length - 1 && <Divider sx={{ borderColor: 'rgba(0,0,0,0.06)' }} />}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}