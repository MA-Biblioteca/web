import React, { createContext, useContext, useState } from "react";

type AporteData = {
  carrera: string;
  anio: string;
  materia: string;
  tipo: string;
};

type AporteContextType = {
  data: AporteData;
  setData: (field: keyof AporteData, value: string) => void;
};

const AporteContext = createContext<AporteContextType | undefined>(undefined);

export const AporteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setDataState] = useState<AporteData>({
    carrera: "",
    anio: "",
    materia: "",
    tipo: "",
  });

  const setData = (field: keyof AporteData, value: string) => {
    setDataState((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <AporteContext.Provider value={{ data, setData }}>
      {children}
    </AporteContext.Provider>
  );
};

export const useAporte = () => {
  const ctx = useContext(AporteContext);
  if (!ctx) throw new Error("useAporte debe usarse dentro de AporteProvider");
  return ctx;
};
