"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Save, Plus, Trash2 } from "lucide-react";

interface SettingEntry {
  key: string;
  value: string;
  type: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newType, setNewType] = useState("text");

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        // API returns { key: { value, type } } map
        const entries: SettingEntry[] = Object.entries(data).map(
          ([key, val]) => ({
            key,
            value: (val as { value: string; type: string }).value,
            type: (val as { value: string; type: string }).type,
          })
        );
        setSettings(entries.sort((a, b) => a.key.localeCompare(b.key)));
      }
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettingValue = (key: string, value: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value } : s))
    );
  };

  const addSetting = () => {
    if (!newKey.trim()) {
      toast.error("Key is required");
      return;
    }
    if (settings.some((s) => s.key === newKey.trim())) {
      toast.error("Key already exists");
      return;
    }
    setSettings((prev) => [
      ...prev,
      { key: newKey.trim(), value: newValue, type: newType },
    ]);
    setNewKey("");
    setNewValue("");
    setNewType("text");
  };

  const removeSetting = (key: string) => {
    setSettings((prev) => prev.filter((s) => s.key !== key));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = settings.map((s) => ({
        key: s.key,
        value: s.value,
        type: s.type,
      }));

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      toast.success("Settings saved successfully");
      fetchSettings();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-gray-200 dark:border-slate-700 border-t-[var(--color-burgundy)] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage site configuration</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-burgundy)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={18} />
          )}
          Save Changes
        </button>
      </motion.div>

      <motion.div
        className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {settings.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">No settings configured yet. Add your first setting below.</p>
        ) : (
          <div className="space-y-4">
            {settings.map((setting) => (
              <div key={setting.key} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-white font-mono">{setting.key}</label>
                    <span className="text-xs text-gray-400 bg-gray-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">{setting.type}</span>
                  </div>
                  {setting.type === "textarea" ? (
                    <textarea
                      value={setting.value}
                      onChange={(e) => updateSettingValue(setting.key, e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none resize-none"
                    />
                  ) : setting.type === "boolean" ? (
                    <select
                      value={setting.value}
                      onChange={(e) => updateSettingValue(setting.key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none"
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  ) : setting.type === "number" ? (
                    <input
                      type="number"
                      value={setting.value}
                      onChange={(e) => updateSettingValue(setting.key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={setting.value}
                      onChange={(e) => updateSettingValue(setting.key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none"
                    />
                  )}
                </div>
                <button
                  onClick={() => removeSetting(setting.key)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-6"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Add New Setting</h3>
          <div className="flex items-end gap-3 flex-wrap">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Key</label>
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none"
                placeholder="e.g. site_name"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Value</label>
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none"
                placeholder="Value"
              />
            </div>
            <div className="w-32">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-burgundy)] focus:border-transparent outline-none"
              >
                <option value="text">Text</option>
                <option value="textarea">Textarea</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
              </select>
            </div>
            <button
              onClick={addSetting}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-slate-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
