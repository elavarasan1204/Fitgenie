'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  changePasswordSchema,
  updateAccountSchema,
  type ChangePasswordFormData,
  type UpdateAccountFormData,
} from '@/validations/settings';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import {
  Lock,
  Loader2,
  User,
  Trash2,
  AlertTriangle,
  Save,
  Shield,
  Mail,
  X,
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [changingPassword, setChangingPassword] = useState(false);
  const [updatingAccount, setUpdatingAccount] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const accountForm = useForm<UpdateAccountFormData>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user?.id || '')
        .single();

      return {
        full_name: profile?.full_name || '',
        email: user?.email || '',
      };
    },
  });

  const onChangePassword = async (data: ChangePasswordFormData) => {
    setChangingPassword(true);
    try {
      const supabase = createClient();

      // Verify current password by re-authenticating
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) { toast.error('User not found'); return; }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: data.current_password,
      });

      if (signInError) {
        toast.error('Current password is incorrect');
        return;
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: data.new_password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Password updated successfully! 🔒');
      passwordForm.reset();
    } catch {
      toast.error('Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const onUpdateAccount = async (data: UpdateAccountFormData) => {
    setUpdatingAccount(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error('Not authenticated'); return; }

      // Update profile name
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: data.full_name })
        .eq('id', user.id);

      if (profileError) {
        toast.error('Failed to update profile');
        return;
      }

      // Update email if changed
      if (data.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: data.email,
        });

        if (emailError) {
          toast.error(emailError.message);
          return;
        }
      }

      toast.success('Account updated successfully!');
    } catch {
      toast.error('Failed to update account');
    } finally {
      setUpdatingAccount(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    setDeleting(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Delete all user data
      await supabase.from('chat_history').delete().eq('user_id', user.id);
      await supabase.from('progress_logs').delete().eq('user_id', user.id);
      await supabase.from('fitness_plans').delete().eq('user_id', user.id);
      await supabase.from('profiles').delete().eq('id', user.id);

      // Sign out
      await supabase.auth.signOut();
      toast.success('Account deleted');
      router.push('/');
      router.refresh();
    } catch {
      toast.error('Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Settings</h1>
        <p className="text-[var(--color-text-secondary)]">Manage your account and security.</p>
      </div>

      {/* Change Password */}
      <div className="glass-card p-6" style={{ transform: 'none' }}>
        <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
          <Shield size={20} className="text-[var(--color-primary-light)]" />
          Change Password
        </h2>
        <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
          <div>
            <label htmlFor="current_password" className="input-label">Current Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                {...passwordForm.register('current_password')}
                id="current_password"
                type="password"
                className={`input-field !pl-11 ${passwordForm.formState.errors.current_password ? 'input-error' : ''}`}
                placeholder="••••••••"
              />
            </div>
            {passwordForm.formState.errors.current_password && (
              <p className="error-message">{passwordForm.formState.errors.current_password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="new_password" className="input-label">New Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                {...passwordForm.register('new_password')}
                id="new_password"
                type="password"
                className={`input-field !pl-11 ${passwordForm.formState.errors.new_password ? 'input-error' : ''}`}
                placeholder="••••••••"
              />
            </div>
            {passwordForm.formState.errors.new_password && (
              <p className="error-message">{passwordForm.formState.errors.new_password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirm_password_settings" className="input-label">Confirm New Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                {...passwordForm.register('confirm_password')}
                id="confirm_password_settings"
                type="password"
                className={`input-field !pl-11 ${passwordForm.formState.errors.confirm_password ? 'input-error' : ''}`}
                placeholder="••••••••"
              />
            </div>
            {passwordForm.formState.errors.confirm_password && (
              <p className="error-message">{passwordForm.formState.errors.confirm_password.message}</p>
            )}
          </div>

          <button type="submit" disabled={changingPassword} className="btn-primary">
            {changingPassword ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
            Update Password
          </button>
        </form>
      </div>

      {/* Update Account */}
      <div className="glass-card p-6" style={{ transform: 'none' }}>
        <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
          <User size={20} className="text-[var(--color-secondary)]" />
          Account Information
        </h2>
        <form onSubmit={accountForm.handleSubmit(onUpdateAccount)} className="space-y-4">
          <div>
            <label htmlFor="full_name_settings" className="input-label">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                {...accountForm.register('full_name')}
                id="full_name_settings"
                type="text"
                className={`input-field !pl-11 ${accountForm.formState.errors.full_name ? 'input-error' : ''}`}
              />
            </div>
            {accountForm.formState.errors.full_name && (
              <p className="error-message">{accountForm.formState.errors.full_name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email_settings" className="input-label">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                {...accountForm.register('email')}
                id="email_settings"
                type="email"
                className={`input-field !pl-11 ${accountForm.formState.errors.email ? 'input-error' : ''}`}
              />
            </div>
            {accountForm.formState.errors.email && (
              <p className="error-message">{accountForm.formState.errors.email.message}</p>
            )}
          </div>

          <button type="submit" disabled={updatingAccount} className="btn-primary">
            {updatingAccount ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="glass-card p-6" style={{ transform: 'none', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-[var(--color-danger)]">
          <AlertTriangle size={20} />
          Danger Zone
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-5">
          Once you delete your account, all data will be permanently removed. This action cannot be undone.
        </p>
        <button onClick={() => setShowDeleteModal(true)} className="btn-danger">
          <Trash2 size={16} />
          Delete Account
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="glass-card max-w-md w-full mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[var(--color-danger)]">Delete Account</h2>
              <button onClick={() => setShowDeleteModal(false)} className="p-1 hover:bg-[var(--color-surface-lighter)] rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 rounded-xl mb-4" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <p className="text-sm flex items-start gap-2">
                <AlertTriangle size={16} className="text-[var(--color-danger)] mt-0.5 flex-shrink-0" />
                This will permanently delete your account, profile, fitness plans, progress logs, and chat history.
              </p>
            </div>
            <div className="mb-4">
              <label className="input-label">Type <strong>DELETE</strong> to confirm</label>
              <input
                type="text"
                value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                className="input-field"
                placeholder="DELETE"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={handleDeleteAccount} disabled={deleteConfirm !== 'DELETE' || deleting} className="btn-danger flex-1 justify-center">
                {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                Delete Forever
              </button>
              <button onClick={() => { setShowDeleteModal(false); setDeleteConfirm(''); }} className="btn-ghost flex-1 justify-center">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
