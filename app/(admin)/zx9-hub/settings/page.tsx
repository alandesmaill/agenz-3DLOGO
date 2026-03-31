'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Users, Plus, Trash2, Shield, Loader2, X, CheckCircle, AlertCircle } from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  async function fetchAdmins() {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setAdmins(Array.isArray(data) ? data : []);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAdmins();
  }, []);

  function clearMessage() {
    setTimeout(() => setMessage(null), 5000);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      clearMessage();
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: name || undefined }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: `Admin "${data.email}" created successfully` });
        setEmail('');
        setPassword('');
        setName('');
        setShowForm(false);
        fetchAdmins();
      } else {
        const errText = typeof data.error === 'string' ? data.error : 'Failed to create admin';
        setMessage({ type: 'error', text: errText });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
      clearMessage();
    }
  }

  async function handleDelete(admin: AdminUser) {
    const confirmed = window.confirm(
      `Are you sure you want to delete admin "${admin.email}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(admin.id);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: admin.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: `Admin "${admin.email}" deleted` });
        fetchAdmins();
      } else {
        const errText = typeof data.error === 'string' ? data.error : 'Failed to delete admin';
        setMessage({ type: 'error', text: errText });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setDeletingId(null);
      clearMessage();
    }
  }

  const currentUserId = session?.user?.id;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Gibson']">Settings</h1>
          <p className="text-white/50 text-sm mt-1">Manage admin users and access</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#00e92c]/10 text-[#00e92c] rounded-xl hover:bg-[#00e92c]/20 transition-colors text-sm font-medium"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Add Admin'}
        </button>
      </div>

      {message && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl mb-6 border ${
            message.type === 'success'
              ? 'bg-[#00e92c]/10 border-[#00e92c]/20 text-[#00e92c]'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}
        >
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      {showForm && (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Plus size={18} className="text-[#00ffff]" />
            New Admin User
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/60 mb-1.5">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-[#00e92c]/50 focus:outline-none transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1.5">
                  Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-[#00e92c]/50 focus:outline-none transition-colors text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Name (optional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Display name"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-[#00e92c]/50 focus:outline-none transition-colors text-sm"
              />
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#00e92c] to-[#00ffff] text-black rounded-xl font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Admin'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center gap-2">
          <Users size={18} className="text-[#00ffff]" />
          <h2 className="text-lg font-semibold text-white">Admin Users</h2>
          <span className="text-white/40 text-sm ml-auto">
            {loading ? '...' : `${admins.length} user${admins.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-[#00ffff]" />
          </div>
        ) : admins.length === 0 ? (
          <div className="text-center py-16 text-white/40">
            <Shield size={32} className="mx-auto mb-3 opacity-50" />
            <p>No admin users found</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {admins.map((admin) => {
              const isSelf = admin.id === currentUserId;
              const isDeleting = deletingId === admin.id;
              return (
                <div
                  key={admin.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      isSelf
                        ? 'bg-[#00e92c]/15 text-[#00e92c]'
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {(admin.name || admin.email)[0].toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white truncate">
                        {admin.name || 'Unnamed'}
                      </p>
                      {isSelf && (
                        <span className="text-[10px] px-2 py-0.5 bg-[#00e92c]/15 text-[#00e92c] rounded-full font-medium shrink-0">
                          YOU
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/40 truncate">{admin.email}</p>
                  </div>

                  <span className="text-xs text-white/30 hidden sm:block shrink-0">
                    {new Date(admin.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>

                  {!isSelf && (
                    <button
                      onClick={() => handleDelete(admin)}
                      disabled={isDeleting}
                      className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50 shrink-0"
                      title={`Delete ${admin.email}`}
                    >
                      {isDeleting ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
