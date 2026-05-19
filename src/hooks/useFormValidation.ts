"use client";

import { useState, useCallback } from "react";
import { validate, type ValidationSchema } from "@/lib/validation";

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
