import { useState, useCallback } from 'react'
import { storage } from '@/lib/storage'
import type { UserProfile } from '@/types'

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(() => storage.getProfile())

  const saveProfile = useCallback((p: UserProfile) => {
    storage.saveProfile(p)
    setProfile(p)
  }, [])

  return { profile, saveProfile }
}
