'use client';

import { useState } from 'react';
import { useProfile } from '@/lib/ProfileContext';
import { ROLE_ARCHETYPES } from '@/lib/constants/insights';
import { CustomRole } from '@/lib/types';
import styles from './TargetRoleManager.module.css';

const ROLE_COLORS = ['#2563EB', '#7C3AED', '#059669', '#DC2626', '#F59E0B', '#6366F1', '#EC4899', '#14B8A6'];

const DEFAULT_FORM = { name: '', icon: '🎯', description: '', skills: '', color: ROLE_COLORS[0] };

export default function TargetRoleManager() {
  const { targetRoleIds, setTargetRoles, customRoles, addCustomRole, removeCustomRole } = useProfile();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);

  const toggleRole = (id: string) => {
    if (targetRoleIds.includes(id)) {
      setTargetRoles(targetRoleIds.filter(r => r !== id));
    } else {
      setTargetRoles([...targetRoleIds, id]);
    }
  };

  const handleAdd = () => {
    if (!form.name.trim()) return;
    const skills = form.skills.split(',').map(s => s.trim()).filter(Boolean);
    const newRole: Omit<CustomRole, 'id'> = {
      name:        form.name.trim(),
      icon:        form.icon || '🎯',
      description: form.description.trim(),
      coreSkills:  skills,
      color:       form.color,
    };
    addCustomRole(newRole);
    setForm(DEFAULT_FORM);
    setShowForm(false);
  };

  const allSelected = targetRoleIds.length === 0;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.title}>Target Roles</div>
        <div className={styles.subtitle}>
          Select roles you are pursuing — gap analysis will focus on those.
          {allSelected && <span className={styles.hint}> (Showing all roles)</span>}
        </div>
      </div>

      {/* Built-in role toggles */}
      <div className={styles.builtinGrid}>
        {ROLE_ARCHETYPES.map(role => {
          const active = targetRoleIds.includes(role.id);
          return (
            <button
              key={role.id}
              className={`${styles.roleChip} ${active ? styles.roleChipActive : ''}`}
              style={active ? { borderColor: role.color, background: `${role.color}14` } : {}}
              onClick={() => toggleRole(role.id)}
              title={role.description}
            >
              <span className={styles.chipIcon}>{role.icon}</span>
              <span className={styles.chipName}>{role.name}</span>
              {active && (
                <span className={styles.chipCheck} style={{ color: role.color }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Custom roles */}
      {customRoles.length > 0 && (
        <div className={styles.customSection}>
          <div className={styles.sectionLabel}>Your Custom Roles</div>
          <div className={styles.customList}>
            {customRoles.map(role => (
              <div key={role.id} className={styles.customItem}>
                <span className={styles.customIcon}>{role.icon}</span>
                <div className={styles.customInfo}>
                  <div className={styles.customName}>{role.name}</div>
                  {role.description && <div className={styles.customDesc}>{role.description}</div>}
                </div>
                <div className={styles.customBadge} style={{ background: `${role.color}20`, color: role.color }}>
                  {role.coreSkills.length} skills
                </div>
                <button
                  className={styles.deleteBtn}
                  onClick={() => removeCustomRole(role.id)}
                  title="Remove role"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add custom role */}
      {showForm ? (
        <div className={styles.form}>
          <div className={styles.formTitle}>Add Custom Role</div>
          <div className={styles.formRow}>
            <div className={styles.formGroup} style={{ flex: '0 0 60px' }}>
              <label className={styles.formLabel}>Icon</label>
              <input
                className={styles.formInput}
                value={form.icon}
                onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                placeholder="🎯"
                maxLength={4}
              />
            </div>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.formLabel}>Role Name *</label>
              <input
                className={styles.formInput}
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Product Manager, UX Designer, Financial Analyst"
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Description</label>
            <input
              className={styles.formInput}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of what this role does"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Key Skills (comma-separated)</label>
            <input
              className={styles.formInput}
              value={form.skills}
              onChange={e => setForm(f => ({ ...f, skills: e.target.value }))}
              placeholder="e.g. stakeholder management, roadmap planning, SQL, Figma, communication"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Accent Color</label>
            <div className={styles.colorPicker}>
              {ROLE_COLORS.map(c => (
                <button
                  key={c}
                  className={`${styles.colorSwatch} ${form.color === c ? styles.colorSwatchActive : ''}`}
                  style={{ background: c }}
                  onClick={() => setForm(f => ({ ...f, color: c }))}
                  title={c}
                />
              ))}
            </div>
          </div>
          <div className={styles.formActions}>
            <button className={styles.cancelBtn} onClick={() => { setShowForm(false); setForm(DEFAULT_FORM); }}>
              Cancel
            </button>
            <button className={styles.saveBtn} onClick={handleAdd} disabled={!form.name.trim()}>
              Add Role
            </button>
          </div>
        </div>
      ) : (
        <button className={styles.addBtn} onClick={() => setShowForm(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Custom Role
        </button>
      )}
    </div>
  );
}
