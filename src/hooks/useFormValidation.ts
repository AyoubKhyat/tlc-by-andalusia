"use client";

import { useState, useCallback } from "react";
import { validate, type ValidationSchema } from "@/lib/validation";

// ---------- New validation API ----------

interface ValidationRules {
  required?: boolean | string;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  custom?: (value: string) => string | null;
}

interface FieldConfig {
  [fieldName: string]: ValidationRules;
}

function validateValue(rules: ValidationRules, value: string): string | null {
  const trimmed = value.trim();

  if (rules.required) {
    if (!trimmed) {
      return typeof rules.required === "string"
        ? rules.required
        : "This field is required";
    }
  }

  if (trimmed && rules.minLength) {
    if (trimmed.length < rules.minLength.value) {
      return rules.minLength.message;
    }
  }

  if (trimmed && rules.maxLength) {
    if (trimmed.length > rules.maxLength.value) {
      return rules.maxLength.message;
    }
  }

  if (trimmed && rules.pattern) {
    if (!rules.pattern.value.test(trimmed)) {
      return rules.pattern.message;
    }
  }

  if (rules.custom) {
    const customError = rules.custom(trimmed);
    if (customError) return customError;
  }

  return null;
}

export function useFieldValidation(config: FieldConfig) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = useCallback(
    (name: string, value: string): string | null => {
      const rules = config[name];
      if (!rules) return null;

      const error = validateValue(rules, value);
      setErrors((prev) => {
        if (error) return { ...prev, [name]: error };
        const next = { ...prev };
        delete next[name];
        return next;
      });
      return error;
    },
    [config]
  );

  const validateAll = useCallback(
    (values: Record<string, string>): boolean => {
      const newErrors: Record<string, string> = {};

      for (const [name, rules] of Object.entries(config)) {
        const value = values[name] || "";
        const error = validateValue(rules, value);
        if (error) {
          newErrors[name] = error;
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [config]
  );

  const clearError = useCallback((name: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const clearAll = useCallback(() => setErrors({}), []);

  return { errors, validateField, validateAll, clearError, clearAll };
}

// ---------- Legacy validation API (uses ValidationSchema from @/lib/validation) ----------

export function useFormValidation(schema: ValidationSchema) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = useCallback(
    (name: string, value: string): string | null => {
      const fieldSchema: ValidationSchema = { [name]: schema[name] || [] };
      const fieldErrors = validate({ [name]: value }, fieldSchema);
      const error = fieldErrors[name] || null;
      setErrors((prev) => {
        if (error) return { ...prev, [name]: error };
        const next = { ...prev };
        delete next[name];
        return next;
      });
      return error;
    },
    [schema]
  );

  const validateAll = useCallback(
    (data: Record<string, string>): boolean => {
      const allErrors = validate(data, schema);
      setErrors(allErrors);
      return Object.keys(allErrors).length === 0;
    },
    [schema]
  );

  const clearError = useCallback((name: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const clearAll = useCallback(() => setErrors({}), []);

  return { errors, validateField, validateAll, clearError, clearAll };
}

export type { ValidationRules, FieldConfig };
