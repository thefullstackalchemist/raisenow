'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Profile, ChatMessage, ActiveField, ResumeTemplate, CustomRole } from './types';

const defaultProfile: Profile = {
  personal: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
};

const defaultTemplates: ResumeTemplate[] = [
  { id: 'classic', name: 'Classic', description: 'Clean and traditional layout', preview: 'classic', isDefault: true },
  { id: 'modern', name: 'Modern', description: 'Contemporary two-column design', preview: 'modern', isDefault: false },
  { id: 'minimal', name: 'Minimal', description: 'Stripped-back simplicity', preview: 'minimal', isDefault: false },
  { id: 'executive', name: 'Executive', description: 'Bold headers, commanding presence', preview: 'executive', isDefault: false },
  { id: 'creative', name: 'Creative', description: 'Sidebar accent with color pop', preview: 'creative', isDefault: false },
  { id: 'technical', name: 'Technical', description: 'Skills-first for engineers', preview: 'technical', isDefault: false },
];

interface ProfileContextType {
  profile: Profile;
  updatePersonal: (field: string, value: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, field: string, value: string | boolean | string[]) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, field: string, value: string) => void;
  removeEducation: (id: string) => void;
  addSkill: (name: string, category?: string) => void;
  removeSkill: (id: string) => void;
  addProject: () => void;
  updateProject: (id: string, field: string, value: string) => void;
  removeProject: (id: string) => void;
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  activeField: ActiveField;
  setActiveField: (field: ActiveField) => void;
  templates: ResumeTemplate[];
  setDefaultTemplate: (id: string) => void;
  selectedTemplate: string;
  colorTheme: string;
  setColorTheme: (id: string) => void;
  targetRoleIds: string[];
  setTargetRoles: (ids: string[]) => void;
  customRoles: CustomRole[];
  addCustomRole: (role: Omit<CustomRole, 'id'>) => void;
  removeCustomRole: (id: string) => void;
  applyAIUpdate: (update: Partial<Profile>) => void;
  dataLoaded: boolean;
  pendingTrigger: string | null;
  setPendingTrigger: (msg: string | null) => void;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeField, setActiveField] = useState<ActiveField>(null);
  const [templates, setTemplates] = useState<ResumeTemplate[]>(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [colorTheme, setColorThemeState] = useState('blue');
  const [targetRoleIds, setTargetRoleIdsState] = useState<string[]>([]);
  const [customRoles, setCustomRolesState] = useState<CustomRole[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [pendingTrigger, setPendingTrigger] = useState<string | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load profile + chat history from DB when session is available
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      setDataLoaded(false);

      const profileFetch = fetch('/api/profile')
        .then(r => r.json())
        .then(data => {
          if (data && !data.error) {
            if (data.personal) setProfile(prev => ({ ...prev, ...data }));
            if (data.selectedTemplate) setSelectedTemplate(data.selectedTemplate);
            if (data.colorTheme) setColorThemeState(data.colorTheme);
            if (Array.isArray(data.targetRoleIds)) setTargetRoleIdsState(data.targetRoleIds);
            if (Array.isArray(data.customRoles)) setCustomRolesState(data.customRoles);
          }
        })
        .catch(() => {});

      const messagesFetch = fetch('/api/messages')
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            const rehydrated = data.map((m: ChatMessage) => ({
              ...m,
              timestamp: new Date(m.timestamp),
            }));
            setMessages(rehydrated);
          }
        })
        .catch(() => {});

      // Mark data as loaded once both fetches settle
      Promise.allSettled([profileFetch, messagesFetch]).then(() => {
        setDataLoaded(true);
      });
    }
    if (status === 'unauthenticated') {
      setMessages([]);
      setDataLoaded(true);
    }
  }, [status, session?.user?.id]);

  // Auto-save profile to DB (debounced 1.5s)
  const scheduleSave = useCallback((
    updatedProfile: Profile,
    template: string,
    theme: string,
    roleIds: string[],
    customRls: CustomRole[],
  ) => {
    if (!session?.user?.id) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updatedProfile,
          selectedTemplate: template,
          colorTheme: theme,
          targetRoleIds: roleIds,
          customRoles: customRls,
        }),
      }).catch(() => {});
    }, 1500);
  }, [session?.user?.id]);

  // Auto-save whenever profile, selectedTemplate, colorTheme, targetRoleIds, or customRoles changes
  const initialLoadDone = useRef(false);
  useEffect(() => {
    if (!initialLoadDone.current) { initialLoadDone.current = true; return; }
    scheduleSave(profile, selectedTemplate, colorTheme, targetRoleIds, customRoles);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, selectedTemplate, colorTheme, targetRoleIds, customRoles]);

  const updatePersonal = useCallback((field: string, value: string) => {
    setProfile(p => ({ ...p, personal: { ...p.personal, [field]: value } }));
  }, []);

  const addExperience = useCallback(() => {
    const newExp = {
      id: genId(),
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      highlights: [],
    };
    setProfile(p => ({ ...p, experience: [...p.experience, newExp] }));
  }, []);

  const updateExperience = useCallback((id: string, field: string, value: string | boolean | string[]) => {
    setProfile(p => ({
      ...p,
      experience: p.experience.map(e => e.id === id ? { ...e, [field]: value } : e),
    }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setProfile(p => ({ ...p, experience: p.experience.filter(e => e.id !== id) }));
  }, []);

  const addEducation = useCallback(() => {
    const newEdu = {
      id: genId(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      highlights: [],
    };
    setProfile(p => ({ ...p, education: [...p.education, newEdu] }));
  }, []);

  const updateEducation = useCallback((id: string, field: string, value: string) => {
    setProfile(p => ({
      ...p,
      education: p.education.map(e => e.id === id ? { ...e, [field]: value } : e),
    }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setProfile(p => ({ ...p, education: p.education.filter(e => e.id !== id) }));
  }, []);

  const addSkill = useCallback((name: string, category = 'General') => {
    const newSkill = { id: genId(), name, category, level: 'intermediate' as const };
    setProfile(p => ({ ...p, skills: [...p.skills, newSkill] }));
  }, []);

  const removeSkill = useCallback((id: string) => {
    setProfile(p => ({ ...p, skills: p.skills.filter(s => s.id !== id) }));
  }, []);

  const addProject = useCallback(() => {
    const newProject = { id: genId(), name: '', description: '', technologies: [] };
    setProfile(p => ({ ...p, projects: [...p.projects, newProject] }));
  }, []);

  const updateProject = useCallback((id: string, field: string, value: string) => {
    setProfile(p => ({
      ...p,
      projects: p.projects.map(pr => pr.id === id ? { ...pr, [field]: value } : pr),
    }));
  }, []);

  const removeProject = useCallback((id: string) => {
    setProfile(p => ({ ...p, projects: p.projects.filter(pr => pr.id !== id) }));
  }, []);

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages(prev => [...prev, msg]);
    // Persist to DB (fire-and-forget)
    if (session?.user?.id) {
      fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg),
      }).catch(() => {});
    }
  }, [session?.user?.id]);

  const setDefaultTemplate = useCallback((id: string) => {
    setSelectedTemplate(id);
    setTemplates(prev => prev.map(t => ({ ...t, isDefault: t.id === id })));
  }, []);

  const setColorTheme = useCallback((id: string) => {
    setColorThemeState(id);
  }, []);

  const setTargetRoles = useCallback((ids: string[]) => {
    setTargetRoleIdsState(ids);
  }, []);

  const addCustomRole = useCallback((role: Omit<CustomRole, 'id'>) => {
    setCustomRolesState(prev => [...prev, { ...role, id: genId() }]);
  }, []);

  const removeCustomRole = useCallback((id: string) => {
    setCustomRolesState(prev => prev.filter(r => r.id !== id));
  }, []);

  const applyAIUpdate = useCallback((update: Partial<Profile>) => {
    setProfile(prev => {
      const next = { ...prev };
      if (update.personal) {
        next.personal = { ...prev.personal };
        for (const [k, v] of Object.entries(update.personal)) {
          if (v) (next.personal as unknown as Record<string, string>)[k] = v;
        }
      }
      if (update.experience?.length) {
        const incoming = update.experience;
        const existing = [...prev.experience];
        incoming.forEach(inc => {
          const match = existing.findIndex(e =>
            e.company.toLowerCase() === inc.company.toLowerCase() ||
            (e.company === '' && existing.length === 0)
          );
          if (match >= 0) {
            existing[match] = { ...existing[match], ...inc, id: existing[match].id };
          } else {
            existing.push({ ...inc, id: genId() });
          }
        });
        next.experience = existing;
      }
      if (update.education?.length) {
        const incoming = update.education;
        const existing = [...prev.education];
        incoming.forEach(inc => {
          const match = existing.findIndex(e =>
            e.institution.toLowerCase() === inc.institution.toLowerCase()
          );
          if (match >= 0) {
            existing[match] = { ...existing[match], ...inc, id: existing[match].id };
          } else {
            existing.push({ ...inc, id: genId() });
          }
        });
        next.education = existing;
      }
      if (update.skills?.length) {
        const existingNames = new Set(prev.skills.map(s => s.name.toLowerCase()));
        const newSkills = update.skills.filter(s => !existingNames.has(s.name.toLowerCase()));
        next.skills = [...prev.skills, ...newSkills.map(s => ({ ...s, id: genId() }))];
      }
      if (update.projects?.length) {
        const existing = [...prev.projects];
        update.projects.forEach(inc => {
          const match = existing.findIndex(p => p.name.toLowerCase() === inc.name.toLowerCase());
          if (match >= 0) {
            existing[match] = { ...existing[match], ...inc, id: existing[match].id };
          } else {
            existing.push({ ...inc, id: genId() });
          }
        });
        next.projects = existing;
      }
      return next;
    });
  }, []);

  return (
    <ProfileContext.Provider value={{
      profile,
      updatePersonal,
      addExperience,
      updateExperience,
      removeExperience,
      addEducation,
      updateEducation,
      removeEducation,
      addSkill,
      removeSkill,
      addProject,
      updateProject,
      removeProject,
      messages,
      addMessage,
      activeField,
      setActiveField,
      templates,
      setDefaultTemplate,
      selectedTemplate,
      colorTheme,
      setColorTheme,
      targetRoleIds,
      setTargetRoles,
      customRoles,
      addCustomRole,
      removeCustomRole,
      applyAIUpdate,
      dataLoaded,
      pendingTrigger,
      setPendingTrigger,
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside ProfileProvider');
  return ctx;
}
