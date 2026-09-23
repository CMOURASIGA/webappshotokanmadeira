import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface StudyItem {
  id: string;
  type: "kata" | "technique";
  title: string;
  subtitle: string;
  categoryOrGroup: string;
  timestamp: number;
  totalMovements?: number;
}

export interface FavoriteItem {
  id: string;
  type: "kata" | "technique";
  title: string;
  subtitle: string;
  categoryOrGroup: string;
  addedAt: number;
}

export interface TechnicalNote {
  id: string;
  title: string;
  content: string;
  relatedItemType?: "kata" | "technique";
  relatedItemId?: string;
  relatedItemTitle?: string;
  createdAt: number;
  updatedAt: number;
}

interface StudentContextType {
  // Recent Study
  recentStudies: StudyItem[];
  lastStudy: StudyItem | null;
  recordStudy: (item: Omit<StudyItem, "timestamp">) => void;
  clearHistory: () => void;
  
  // Kata movements checklist & coverage
  kataMovementsProgress: Record<string, number[]>; // kataId -> array of completed movement indexes
  toggleKataMovement: (kataId: string, movementIndex: number) => void;
  isMovementCompleted: (kataId: string, movementIndex: number) => boolean;
  getKataProgress: (kataId: string, totalMovements: number) => { completed: number; total: number; percentage: number };

  // Favorites
  favorites: FavoriteItem[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (item: Omit<FavoriteItem, "addedAt">) => void;
  removeFavorite: (id: string) => void;

  // Graduation Exam Checklist
  selectedExamBeltId: string;
  setSelectedExamBeltId: (beltId: string) => void;
  examChecklist: Record<string, boolean>;
  toggleExamRequirement: (beltIdOrKey: string, requirementIndex?: number) => void;
  isExamRequirementCompleted: (beltIdOrKey: string, requirementIndex?: number) => boolean;
  getBeltExamProgress: (beltId: string, requirementsLength: number) => { completed: number; total: number; percentage: number };

  // Technical Notes
  technicalNotes: TechnicalNote[];
  addTechnicalNote: (note: { title: string; content: string; relatedItemType?: "kata" | "technique"; relatedItemId?: string; relatedItemTitle?: string }) => void;
  updateTechnicalNote: (id: string, note: { title: string; content: string; relatedItemType?: "kata" | "technique"; relatedItemId?: string; relatedItemTitle?: string }) => void;
  deleteTechnicalNote: (id: string) => void;
}

const STORAGE_KEYS = {
  RECENT_STUDIES: "madeira_student_recent_studies_v1",
  KATA_PROGRESS: "madeira_student_kata_progress_v1",
  FAVORITES: "madeira_student_favorites_v1",
  EXAM_BELT: "madeira_student_exam_belt_v2",
  EXAM_CHECKLIST: "madeira_student_exam_checklist_v2",
  TECHNICAL_NOTES: "madeira_student_technical_notes_v1",
  MIGRATION_FLAG: "madeira_student_exam_migration_v2_applied",
};

const StudentContext = createContext<StudentContextType | undefined>(undefined);

function safeParse<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

export function StudentProvider({ children }: { children: ReactNode }) {
  // 1. Recent Studies
  const [recentStudies, setRecentStudies] = useState<StudyItem[]>(() =>
    safeParse<StudyItem[]>(STORAGE_KEYS.RECENT_STUDIES, [])
  );

  // 2. Kata Movements Progress
  const [kataMovementsProgress, setKataMovementsProgress] = useState<Record<string, number[]>>(() =>
    safeParse<Record<string, number[]>>(STORAGE_KEYS.KATA_PROGRESS, {})
  );

  // 3. Favorites
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() =>
    safeParse<FavoriteItem[]>(STORAGE_KEYS.FAVORITES, [])
  );

  // 4. Graduation Exam (Schema V2 JKA com migração controlada)
  const [selectedExamBeltId, setSelectedExamBeltIdState] = useState<string>(() => {
    try {
      const v2Belt = localStorage.getItem(STORAGE_KEYS.EXAM_BELT);
      if (v2Belt && v2Belt !== "red") {
        if (v2Belt === "brown") return "brown-3";
        if (v2Belt === "black") return "black-1";
        return v2Belt;
      }
      const v1Belt = localStorage.getItem("madeira_student_exam_belt_v1");
      if (v1Belt) {
        if (v1Belt === "red") return "yellow";
        if (v1Belt === "brown") return "brown-3";
        if (v1Belt === "black") return "black-1";
        if (["white", "yellow", "orange", "green", "purple"].includes(v1Belt)) return v1Belt;
      }
    } catch {
      // ignore
    }
    return "yellow";
  });

  const [examChecklist, setExamChecklist] = useState<Record<string, boolean>>(() => {
    try {
      const migrationApplied = localStorage.getItem(STORAGE_KEYS.MIGRATION_FLAG);
      if (!migrationApplied) {
        // Reset controlado exclusivamente do checklist antigo desatualizado
        localStorage.removeItem("madeira_student_exam_checklist_v1");
        localStorage.setItem(STORAGE_KEYS.MIGRATION_FLAG, "true");
        return {};
      }
      return safeParse<Record<string, boolean>>(STORAGE_KEYS.EXAM_CHECKLIST, {});
    } catch {
      return {};
    }
  });

  // 5. Technical Notes
  const [technicalNotes, setTechnicalNotes] = useState<TechnicalNote[]>(() =>
    safeParse<TechnicalNote[]>(STORAGE_KEYS.TECHNICAL_NOTES, [])
  );

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECENT_STUDIES, JSON.stringify(recentStudies));
    } catch {
      // Storage unavailable or quota reached
    }
  }, [recentStudies]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.KATA_PROGRESS, JSON.stringify(kataMovementsProgress));
    } catch {
      // ignore
    }
  }, [kataMovementsProgress]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXAM_BELT, selectedExamBeltId);
    } catch {
      // ignore
    }
  }, [selectedExamBeltId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXAM_CHECKLIST, JSON.stringify(examChecklist));
    } catch {
      // ignore
    }
  }, [examChecklist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TECHNICAL_NOTES, JSON.stringify(technicalNotes));
    } catch {
      // ignore
    }
  }, [technicalNotes]);

  // Last study item
  const lastStudy = recentStudies.length > 0 ? recentStudies[0] : null;

  // Record study
  const recordStudy = useCallback((item: Omit<StudyItem, "timestamp">) => {
    setRecentStudies(prev => {
      const now = Date.now();
      const filtered = prev.filter(s => s.id !== item.id);
      const updated: StudyItem = { ...item, timestamp: now };
      return [updated, ...filtered].slice(0, 15);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setRecentStudies([]);
  }, []);

  // Kata Movement Checklist
  const toggleKataMovement = useCallback((kataId: string, movementIndex: number) => {
    setKataMovementsProgress(prev => {
      const currentList = prev[kataId] || [];
      const exists = currentList.includes(movementIndex);
      const updated = exists
        ? currentList.filter(idx => idx !== movementIndex)
        : [...currentList, movementIndex].sort((a, b) => a - b);
      return { ...prev, [kataId]: updated };
    });
  }, []);

  const isMovementCompleted = useCallback((kataId: string, movementIndex: number) => {
    return (kataMovementsProgress[kataId] || []).includes(movementIndex);
  }, [kataMovementsProgress]);

  const getKataProgress = useCallback((kataId: string, totalMovements: number) => {
    const completedList = kataMovementsProgress[kataId] || [];
    const completed = completedList.length;
    if (!totalMovements || totalMovements <= 0) {
      return { completed: 0, total: 0, percentage: 0 };
    }
    const percentage = Math.min(100, Math.round((completed / totalMovements) * 100));
    return { completed, total: totalMovements, percentage };
  }, [kataMovementsProgress]);

  // Favorites
  const isFavorite = useCallback((id: string) => {
    return favorites.some(fav => fav.id === id);
  }, [favorites]);

  const toggleFavorite = useCallback((item: Omit<FavoriteItem, "addedAt">) => {
    setFavorites(prev => {
      const exists = prev.some(fav => fav.id === item.id);
      if (exists) {
        return prev.filter(fav => fav.id !== item.id);
      }
      return [{ ...item, addedAt: Date.now() }, ...prev];
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  }, []);

  // Graduation Exam
  const setSelectedExamBeltId = useCallback((beltId: string) => {
    setSelectedExamBeltIdState(beltId);
  }, []);

  const toggleExamRequirement = useCallback((beltIdOrKey: string, requirementIndex?: number) => {
    const key = requirementIndex !== undefined ? `${beltIdOrKey}_${requirementIndex}` : beltIdOrKey;
    setExamChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, []);

  const isExamRequirementCompleted = useCallback((beltIdOrKey: string, requirementIndex?: number) => {
    const key = requirementIndex !== undefined ? `${beltIdOrKey}_${requirementIndex}` : beltIdOrKey;
    return Boolean(examChecklist[key]);
  }, [examChecklist]);

  const getBeltExamProgress = useCallback((beltId: string, requirementsLength: number) => {
    if (requirementsLength <= 0) return { completed: 0, total: 0, percentage: 0 };
    let completed = 0;
    for (const [k, v] of Object.entries(examChecklist)) {
      if (v && k.startsWith(`${beltId}_`)) {
        completed++;
      }
    }
    const safeCompleted = Math.min(completed, requirementsLength);
    const percentage = Math.round((safeCompleted / requirementsLength) * 100);
    return { completed: safeCompleted, total: requirementsLength, percentage };
  }, [examChecklist]);

  // Technical Notes
  const addTechnicalNote = useCallback((noteData: {
    title: string;
    content: string;
    relatedItemType?: "kata" | "technique";
    relatedItemId?: string;
    relatedItemTitle?: string;
  }) => {
    const newNote: TechnicalNote = {
      id: "note_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      title: noteData.title.trim() || "Anotação Técnica",
      content: noteData.content.trim(),
      relatedItemType: noteData.relatedItemType,
      relatedItemId: noteData.relatedItemId,
      relatedItemTitle: noteData.relatedItemTitle,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setTechnicalNotes(prev => [newNote, ...prev]);
  }, []);

  const updateTechnicalNote = useCallback((id: string, noteData: {
    title: string;
    content: string;
    relatedItemType?: "kata" | "technique";
    relatedItemId?: string;
    relatedItemTitle?: string;
  }) => {
    setTechnicalNotes(prev =>
      prev.map(note =>
        note.id === id
          ? {
              ...note,
              title: noteData.title.trim() || note.title,
              content: noteData.content.trim(),
              relatedItemType: noteData.relatedItemType ?? note.relatedItemType,
              relatedItemId: noteData.relatedItemId ?? note.relatedItemId,
              relatedItemTitle: noteData.relatedItemTitle ?? note.relatedItemTitle,
              updatedAt: Date.now()
            }
          : note
      )
    );
  }, []);

  const deleteTechnicalNote = useCallback((id: string) => {
    setTechnicalNotes(prev => prev.filter(note => note.id !== id));
  }, []);

  const value: StudentContextType = {
    recentStudies,
    lastStudy,
    recordStudy,
    clearHistory,
    kataMovementsProgress,
    toggleKataMovement,
    isMovementCompleted,
    getKataProgress,
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    selectedExamBeltId,
    setSelectedExamBeltId,
    examChecklist,
    toggleExamRequirement,
    isExamRequirementCompleted,
    getBeltExamProgress,
    technicalNotes,
    addTechnicalNote,
    updateTechnicalNote,
    deleteTechnicalNote,
  };

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
}
