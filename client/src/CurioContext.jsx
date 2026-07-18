import {createContext, useContext, useState} from "react";

const CurioContext = createContext(null);

export function CurioProvider({children}) {
  const [bundle, setBundle] = useState(null);
  const [age, setAge] = useState(null);

  return (
    <CurioContext.Provider value={{bundle, setBundle, age, setAge}}>
      {children}
    </CurioContext.Provider>
  );
}

export function useCurio() {
  const ctx = useContext(CurioContext);
  if (!ctx) throw new Error("useCurio must be used within a CurioProvider");
  return ctx;
}
